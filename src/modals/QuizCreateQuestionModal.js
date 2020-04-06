import React, { Fragment } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Clipboard } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon             from '@expo/vector-icons/Ionicons';
import MaterialCommunity   from '@expo/vector-icons/MaterialCommunityIcons';
import SegmentedControlIOS from '@react-native-community/segmented-control';

import * as Animatable from 'react-native-animatable';

import { Navigation } from 'react-native-navigation';
import { Divider } from 'react-native-elements';
import { iOSUIKit } from 'react-native-typography';

import { ModalBackground     } from 'app/src/components/ModalBackground';
import { ModalHeader         } from 'app/src/components/ModalHeader';
import { ModalFooter         } from 'app/src/components/ModalFooter';
import { ModalFooterButton   } from 'app/src/components/ModalFooterButton';
import { ModalSection        } from 'app/src/components/ModalSection';
import { ModalOverlayCheck   } from 'app/src/components/ModalOverlayCheck';
import { ModalSectionHeader  } from 'app/src/components/ModalSectionHeader';
import { ModalInputMultiline } from 'app/src/components/ModalInputMultiline';
import { ListFooterIcon      } from 'app/src/components/ListFooterIcon';
import { ImageTitleSubtitle  } from 'app/src/components/ImageTitleSubtitle';
import { ButtonGradient      } from 'app/src/components/ButtonGradient';
import { ListItemBadge       } from 'app/src/components/ListItemBadge';

import { MNPQuizCreateQuestion } from 'app/src/constants/NavParams';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { SectionTypes, SectionTypeTitles, SectionTypeDescs } from 'app/src/constants/SectionTypes';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';

// TODO:
// [ ] Add switch to preserve choice order
// [x] Implement editing/deleting of choices
// [ ] add delete button when isEditing
// [ ] add reorder button in choices
// [ ] add
// [x] avoid duplicates in choices
// [ ] debug data flow (check values in object when passing/receiving)


function getTitleSubtitle(choiceCount){
  const suffix = Helpers.plural('choice', choiceCount);

  return ((choiceCount <= 0)? {
    title   : 'No Choices Yet',
    subtitle: 'You need to create a minimium of at least two choices first!',
  }:(choiceCount <= 0)? {
    title   : 'Add at least one more!',
    subtitle: 'You need to create a minimium of at least two choices first!',
  }:(choiceCount <= 3)? {
    title   : `Showing ${choiceCount} ${suffix}`,
    subtitle: 'You can add up to a maximum of 4 choices. The selected choice is the correct answer for this question.',
  }:{
    title   : `Showing ${choiceCount} ${suffix}`,
    subtitle: "Sorry, you can't add any more choices. The selected choice is the correct answer for this question.",
  });
};

class ChoiceItem extends React.PureComponent {
  static styles = StyleSheet.create({
    divider: {
      margin: 10,
    },
    borderTop: {
      borderTopWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    choiceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
    },
    choiceText: {
      ...iOSUIKit.bodyObject,
      marginLeft: 10,
    },
    choiceTextSelected: {
      ...iOSUIKit.bodyEmphasizedObject,
      marginLeft: 10,
      color: Colors.GREEN.A700,
      fontWeight: '700',
    },
  });

  _handleOnPressChoice = () => {
    const { onPressChoice, selectedChoice, index, choice } = this.props;
    const isSelected = (selectedChoice == choice);

    this.containerRef.pulse(300);

    if(!isSelected){
      onPressChoice && onPressChoice(
        { index, choice }
      );
    };
  };

  render(){
    const { styles } = ChoiceItem;
    const { index, choice, selectedChoice, isLast } = this.props;

    const isSelected = (choice == selectedChoice);
    const isFirst    = (index == 0);
    
    return(
      <Fragment>
        <Animatable.View
          ref={r => this.containerRef = r}
          useNativeDriver={true}
        >
          <TouchableOpacity
            onPress={this._handleOnPressChoice}
            activeOpacity={0.9}
            style={[styles.choiceContainer, {
              ...(!isFirst && styles.borderTop    ),
              ...(isFirst  && { paddingTop   : 0 }),
              ...(isLast   && { paddingBottom: 0 }),
            }]}
          >
            <ListItemBadge
              value={Helpers.getLetter(index)}
              size={20}
              color={(isSelected
                ? Colors.GREEN .A700
                : Colors.INDIGO.A200
              )}
            />
            <Text style={(isSelected
              ? styles.choiceTextSelected
              : styles.choiceText
            )}>
              {choice}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </Fragment>
    );
  };
};

class SectionMultipleChoice extends React.PureComponent {
  static propTypes = {
    onAddChoice: PropTypes.onAddChoice,
  };

  static styles = StyleSheet.create({
    buttonCreateChoice: {
      marginHorizontal: 0, 
      marginVertical: 0
    },
    divider: {
      marginTop: 10,
      marginBottom: 12,
    },
    choicesContainer: {
      marginTop: 12,
    },
  });

  constructor(props){
    super(props);
    
    this.state = {
      choices       : props.choices ?? [],
      selectedChoice: props.selectedChoices ?? null,
    };
  };

  addChoice = async (choice = '') => {
    this.rootContainerRef.pulse(750);
    await this.headerRef.fadeOut(250);

    this.setState((prevState) => ({
      choices: [
        ...(prevState.choices ?? []),
        choice
      ],
    }));

    await this.headerRef.fadeIn(250);
  };

  getChoices = () => {
    const { choices, selectedChoice } = this.state;
    
    return ({ choices, selectedChoice });
  };

  validate = (animate) => {
    const { choices, selectedChoice } = this.state;
    const choiceCount = choices?.length ?? 0;

    const isValid = (
      (choiceCount    >= 2   ) &&
      (selectedChoice != null)
    );

    if(animate){
      this.rootContainerRef.shake(750);
    };

    return isValid;
  };

  _handleOnPressAddChoice = async () => {
    const { onAddChoice } = this.props;
    const { choices } = this.state;

    const choiceCount = choices?.length ?? 0;
    if(choiceCount >= 4){
      Alert.alert(
        "Max Reached",
        "Cannot add any more choices, sorry."
      );
      // early return
      return;
    };

    try {
      const textInput = await Helpers.asyncAlertInput({
        title : 'New Choice Item',
        desc  : 'Type out the choice to be added.',
        okText: 'Add'
      });

      const isDuplicate = choices.includes(textInput);

      if(!Validate.isNotNullOrWhitespace(textInput)){
        Alert.alert(
          'Invalid Input', 
          'Cannot create choice with the given input value, please try again.'
        );
      
      } else if(isDuplicate) {
        Alert.alert(
          'Choice already exists', 
          'Cannot add item because the choice already exists.'
        );

      } else {
        await this.addChoice(textInput);

        // call callback
        onAddChoice && onAddChoice(textInput);
      };
    } catch(error){
      console.log('Cancel pressed.');
    };
  };

  // ChoiceItem: onPress callback
  _handleOnPressChoice = ({choice, index}) => {
    this.setState({
      selectedChoice: choice,
    });
  };

  render(){
    const { styles } = SectionMultipleChoice;
    const { choices, selectedChoice } = this.state;
    const props = this.props;

    const choiceCount = choices?.length ?? 0;
    const imageTitleSubtitleProps = getTitleSubtitle(choiceCount);

    return (
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <ModalSection showBorderTop={false}>
          <Animatable.View
            ref={r => this.headerRef = r}
            useNativeDriver={true}
          >
            <ImageTitleSubtitle
              imageSource={require('app/assets/icons/lbw-laptop-construction.png')}
              hasPadding={false}
              {...imageTitleSubtitleProps}
            />
          </Animatable.View>
          {(choiceCount > 0) && (
            <Animatable.View 
              style={styles.choicesContainer}
              ref={r => this.choicesContainerRef = r}
              useNativeDriver={true}
            >
              {choices.map((choice, index) =>
                <ChoiceItem
                  isLast={(index == (choiceCount - 1))}
                  onPressChoice={this._handleOnPressChoice}
                  {...{choice, index, selectedChoice}}
                />
              )}
            </Animatable.View>
          )}
          <Divider style={styles.divider}/>
          <ButtonGradient
            containerStyle={styles.buttonCreateChoice}
            bgColor={Colors.BLUE[100]}
            fgColor={Colors.BLUE['A700']}
            alignment={'CENTER'}
            title={'Create Choice Item'}
            onPress={this._handleOnPressAddChoice}
            iconDistance={10}
            isBgGradient={false}
            addShadow={false}
            showIcon={true}
            leftIcon={(
              <Ionicon
                name={'ios-add-circle'}
                color={Colors.BLUE['A700']}
                size={25}
              />
            )}
          />
        </ModalSection>
      </Animatable.View>
    );
  };
};

class SectionTrueOrFalse extends React.PureComponent {
  constructor(props){
    super(props);
    
    this.state = {
      selectedIndex: (
        props.initialValue? 0 : 1
      ),
    };
  };

  getAnswerValue = () => {
    const { selectedIndex } = this.state;
    return( selectedIndex == 0 );
  };

  _handleOnChange = ({nativeEvent}) => {
    this.setState({
      selectedIndex: nativeEvent.selectedSegmentIndex
    });
  };

  render(){
    const { selectedIndex } = this.state;

    return(
      <ModalSection showBorderTop={false}>
        <SegmentedControlIOS
          style={{height: 35}}
          values={['True', 'False']}
          activeTextColor={Colors.BLUE[1000]}
          onChange={this._handleOnChange}
          {...{selectedIndex}}
        />
      </ModalSection>
    );
  };
};

export class QuizCreateQuestionModal extends React.Component {
  static options() {
    return {
    };
  };

  static styles = StyleSheet.create({
    buttonAddSectionEmpty: {
      paddingHorizontal: 0,
      margin: 0,
    },
    divider: {
      margin: 12,
    },
  });

  constructor(props){
    super(props);

    // get section from props
    const section      = props[MNPQuizCreateQuestion.quizSection ];
    const prevQuestion = props[MNPQuizCreateQuestion.quizQuestion];
    const isEditing    = props[MNPQuizCreateQuestion.isEditing   ];

    let question = new QuizQuestionModel();
    if(isEditing){
      question.values = {
        ...(prevQuestion ?? {})
      };
    } else {
      question.setDateCreated();
      question.initFromSection(section);
    };

    this.question = question;
    
    this.state = {
      ...question.values,
    };
  };

  validate(animate = false){
    const props = this.props;

    const section     = props  [MNPQuizCreateQuestion.quizSection];
    const sectionType = section[QuizSectionKeys.sectionType];

    const isValidQuestion = this.inputFieldRefQuestion.isValid(animate);

    switch (sectionType) {
      case SectionTypes.IDENTIFICATION:
      case SectionTypes.MATCHING_TYPE :
        const isValidSubtitle = this.inputFieldRefAnswer.isValid(false);
        animate && this.inputFieldRefAnswer.isValid(true);
        return (isValidQuestion && isValidSubtitle);

      case SectionTypes.MULTIPLE_CHOICE:
        const isValidChoices = this.multipleChoiceRef.validate(false)
        animate && this.multipleChoiceRef.validate(true);
        return (isValidQuestion && isValidChoices);

      case SectionTypes.TRUE_OR_FALSE:
        return (isValidQuestion);
    };
  };

  updateQuestion = () => {
    const props = this.props;

    const section     = props  [MNPQuizCreateQuestion.quizSection];
    const isEditing   = props  [MNPQuizCreateQuestion.isEditing];
    const sectionType = section[QuizSectionKeys.sectionType];

    // set question text
    const questionText = this.inputFieldRefQuestion.getTextValue();
    this.question.questionText = questionText;

    switch (sectionType) {
      case SectionTypes.IDENTIFICATION:
      case SectionTypes.MATCHING_TYPE :
        const answerText = this.inputFieldRefAnswer.getTextValue();
        this.question.answer = answerText;
        break;
    
      case SectionTypes.MULTIPLE_CHOICE:
        const { choices, selectedChoice } = this.multipleChoiceRef.getChoices();
        this.question.answer = selectedChoice;
        this.question.addChoices(choices, isEditing);
        break;

      case SectionTypes.TRUE_OR_FALSE:
        const answerBool = this.trueOrFalseRef.getAnswerValue();
        this.question.answer = answerBool;
        break;
    };
  };

  // check if values were edited
  hasUnsavedChanges = () => {
    const props = this.props;
    const state = this.state;

    const isEditing = props[MNPQuizCreateQuestion.isEditing];
    const section   = props[MNPQuizCreateQuestion.quizSection];

    const sectionType = section[QuizSectionKeys.sectionType];
    this.updateQuestion();

    const prevQuestion = props[MNPQuizCreateQuestion.quizQuestion];
    const nextQuestion = this.question.values;

    const prevQuestionText = prevQuestion[QuizQuestionKeys.questionText   ];
    const prevAnswer       = prevQuestion[QuizQuestionKeys.questionAnswer ];
    const prevChoices      = prevQuestion[QuizQuestionKeys.questionChoices];

    const nextQuestionText = nextQuestion[QuizQuestionKeys.questionText   ];
    const nextAnswer       = nextQuestion[QuizQuestionKeys.questionAnswer ];
    const nextChoices      = prevQuestion[QuizQuestionKeys.questionChoices];
    
    // todo: compare choices
    const didChangeChoices = ((sectionType == SectionTypes.TRUE_OR_FALSE)
      ? prevChoices.length != nextChoices.length
      : false
    );

    return (isEditing? (
      (prevQuestionText != nextQuestionText) || 
      (prevAnswer       != nextAnswer      )
    ):(
      (nextQuestionText != '') ||
      (nextAnswer       != '')
    ));
  };

  // ModalFooter: save button
  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;

    const isEditing   = props[MNPQuizCreateQuestion.isEditing];
    const onPressDone = props[MNPQuizCreateQuestion.onPressDone];

    const isValid = this.validate(false);
    if(!isValid){
      await Helpers.asyncAlert({
        title: 'Invalid Input',
        desc : 'Oops, please fill out the required items to continue.'
      });

      // animate shake and early exit
      return this.validate(true);
    };
    
    // update question model
    this.updateQuestion();

    // trigger callback event
    onPressDone && onPressDone({
      question: this.question.values,
    });

    // check animation
    await this.overlay.start();

    // close modal
    Navigation.dismissModal(componentId);
  };

  // ModalFooter: cancel button
  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;
    const didChange = this.hasUnsavedChanges();

    await Helpers.timeout(200);

    if(didChange){
      const shouldDiscard = await Helpers.asyncActionSheetConfirm({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard all of your changes?',
        confirmText: 'Discard',
        isDestructive: true,
      });

      // early exit if cancel, otherwise close modal
      if(!shouldDiscard) return;
    };

    //close modal
    Navigation.dismissModal(componentId);
  };

  _renderSectionAnswer(){
    const props = this.props;
    const state = this.state;

    const section   = props[MNPQuizCreateQuestion.quizSection];
    const isEditing = props[MNPQuizCreateQuestion.isEditing];

    const sectionType = section[QuizSectionKeys.sectionType];

    const answer  = state[QuizQuestionKeys.questionAnswer ];
    const choices = state[QuizQuestionKeys.questionChoices];


    switch (sectionType) {
      case SectionTypes.MATCHING_TYPE :
      case SectionTypes.IDENTIFICATION: return (
        <ModalSection showBorderTop={false}>
          <ModalInputMultiline
            index={1}
            ref={r => this.inputFieldRefAnswer = r}
            inputRef={r => this.inputRefAnswer = r}
            subtitle={"Enter the question's answer"}
            placeholder={'Input Answer Text'}
            initialValue={(answer ?? '')}
            onSubmitEditing={this._handleOnSubmitEditing}
            validate={Validate.isNotNullOrWhitespace}
          />
        </ModalSection>
      );
      case SectionTypes.MULTIPLE_CHOICE: return (
        <SectionMultipleChoice
          ref={r => this.multipleChoiceRef = r}
          selectedChoices={answer}
          {...{choices}}
        />
      );
      case SectionTypes.TRUE_OR_FALSE: return (
        <SectionTrueOrFalse
          ref={r => this.trueOrFalseRef = r}
          initialValue={answer}
        />
      );
    };
  };

  render(){
    const props = this.props;
    const state = this.state;

    const section   = props[MNPQuizCreateQuestion.quizSection];
    const isEditing = props[MNPQuizCreateQuestion.isEditing];

    const sectionTitle = section[QuizSectionKeys.sectionTitle];
    const sectionType  = section[QuizSectionKeys.sectionType];

    const displaySectionType = SectionTypeTitles[sectionType];
    const displaySectionDesc = SectionTypeDescs [sectionType];

    const modalHeader = (
      <ModalHeader
        title={(isEditing
          ? 'Edit Question'
          : 'New Question'
        )}
        subtitle={(isEditing
          ? `Edit this question's details`
          : `Create a new question for ${sectionTitle}`
        )}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-add-circle'}
            size={24}
            color={'white'}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonRightSubtitle={'Discard Changes'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
          buttonLeftTitle={(isEditing? 'Update' : 'Done')}
          buttonLeftSubtitle={(isEditing? 'Save changes' : 'Create Question')}
        />
      </ModalFooter>
    );

    const overlay = (
      <ModalOverlayCheck
        ref={r => this.overlay = r}
      />
    );

    return (
      <ModalBackground
        stickyHeaderIndices={[0, 1, 3]}
        animateAsGroup={true}
        {...{modalHeader, modalFooter, overlay}}
      >
        <ModalSection showBorderTop={false}>
          <ImageTitleSubtitle
            title={`New ${displaySectionType} item`}
            subtitle={displaySectionDesc}
            imageSource={require('app/assets/icons/e-book-computer.png')}
            hasPadding={false}
            title={(isEditing
              ? `${displaySectionType} item`
              : `New ${displaySectionType} item`
            )}
          />
        </ModalSection>
        <ModalSectionHeader
          title={'Question'}
          showTopBorder={false}
          titleIcon={(
            <MaterialCommunity
              name={'format-letter-case'}
              size={24}
              color={Colors.INDIGO.A400}
            />
          )}
        />
        <ModalSection showBorderTop={false}>
          <ModalInputMultiline
            index={0}
            ref={r => this.inputFieldRefQuestion = r}
            inputRef={r => this.inputRefQuestion = r}
            subtitle={'Enter the question you want to ask'}
            placeholder={'Input Question Text'}
            initialValue={state[QuizQuestionKeys.questionText] ?? ''}
            onSubmitEditing={this._handleOnSubmitEditing}
            validate={Validate.isNotNullOrWhitespace}
          />
        </ModalSection>
        <ModalSectionHeader
          title={'Answer'}
          titleIcon={(
            <Ionicon
              name={'ios-list'}
              size={24}
              color={Colors.INDIGO.A400}
            />
          )}
        />
        {this._renderSectionAnswer()}
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};