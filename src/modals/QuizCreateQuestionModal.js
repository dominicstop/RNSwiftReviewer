import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon           from '@expo/vector-icons/Ionicons';
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons';

import { Navigation } from 'react-native-navigation';

import { ModalBackground     } from 'app/src/components/ModalBackground';
import { ModalHeader         } from 'app/src/components/ModalHeader';
import { ModalFooter         } from 'app/src/components/ModalFooter';
import { ModalFooterButton   } from 'app/src/components/ModalFooterButton';
import { ModalSection        } from 'app/src/components/ModalSection';
import { ModalSectionButton  } from 'app/src/components/ModalSectionButton';
import { ModalOverlayCheck   } from 'app/src/components/ModalOverlayCheck';
import { ModalSectionHeader  } from 'app/src/components/ModalSectionHeader';
import { ModalInputMultiline } from 'app/src/components/ModalInputMultiline';
import { ListFooterIcon      } from 'app/src/components/ListFooterIcon';
import { ImageTitleSubtitle  } from 'app/src/components/ImageTitleSubtitle';

import { MNPQuizCreateQuestion } from 'app/src/constants/NavParams';

import { SectionTrueOrFalse    } from 'app/src/components/QuizCreateQuestionModal/SectionTrueOrFalse';
import { SectionMatchingType   } from 'app/src/components/QuizCreateQuestionModal/SectionMatchingType';
import { SectionMultipleChoice } from 'app/src/components/QuizCreateQuestionModal/SectionMultipleChoice';

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
// [x] avoid duplicates in choices
// [ ] debug data flow (check values in object when passing/receiving)


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
        const isValidSubtitle = this.inputFieldRefAnswer.isValid(false);
        animate && this.inputFieldRefAnswer.isValid(true);
        return (isValidQuestion && isValidSubtitle);

      case SectionTypes.MULTIPLE_CHOICE:
        const isValidChoices = this.multipleChoiceRef.validate(false)
        animate && this.multipleChoiceRef.validate(true);
        return (isValidQuestion && isValidChoices);

      case SectionTypes.TRUE_OR_FALSE:
        return (isValidQuestion);

      case SectionTypes.MATCHING_TYPE:
        //TODO: WIP
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

      case SectionTypes.MATCHING_TYPE :
        //TODO: WIP
        const answer = this.matchingTypeRef.getAnswerValue();
        this.question.answer = answer;
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
    //const didChangeChoices = ((sectionType == SectionTypes.TRUE_OR_FALSE)
    //  ? prevChoices.length != nextChoices.length
    //  : false
    //);

    return (isEditing? (
      (prevQuestionText != nextQuestionText) || 
      (prevAnswer       != nextAnswer      )
    ):(
      (nextQuestionText != '') ||
      (nextAnswer       != '')
    ));
  };

  // ModalSectionButton: onPress delete
  _handleOnPressDelete = async () => {
    const { componentId, ...props } = this.props;

    const question      = props[MNPQuizCreateQuestion.quizQuestion ];
    const onPressDelete = props[MNPQuizCreateQuestion.onPressDelete];

    const confirm = await Helpers.asyncActionSheetConfirm({
      title        : 'Delete this Question?',
      message      : "Are you sure you want to delete this question?",
      confirmText  : 'Delete',
      isDestructive: true,
    });

    // early return if cancel
    if(!confirm) return;

    // call callback
    onPressDelete && onPressDelete({question});
    // close modal
    Navigation.dismissModal(componentId);
  };

  // ModalFooter: onPress save button
  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;
    const hasChanges = this.hasUnsavedChanges();

    const isEditing   = props[MNPQuizCreateQuestion.isEditing];
    const onPressDone = props[MNPQuizCreateQuestion.onPressDone];

    const isValid = this.validate(false);
    if(!hasChanges && isEditing){
      // no changes, close modal
      Navigation.dismissModal(componentId);

    } else if (!isValid){
      await Helpers.asyncAlert({
        title: 'Invalid Input',
        desc : 'Oops, please fill out the required items to continue.'
      });

      // animate shake
      this.validate(true);

    } else {
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
  };

  // ModalFooter: onPress cancel button
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
      case SectionTypes.IDENTIFICATION: return (
        <ModalSection showBorderTop={false}>
          <ModalInputMultiline
            index={1}
            ref={r => this.inputFieldRefAnswer = r}
            inputRef={r => this.inputRefAnswer = r}
            subtitle={"Enter the corresponding answer"}
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
      case SectionTypes.MATCHING_TYPE: return(
        <SectionMatchingType
          ref={r => this.matchingTypeRef = r}
          {...{section, answer, isEditing}}
        />
      );
    };
  };

  render(){
    const props = this.props;
    const state = this.state;

    const section   = props[MNPQuizCreateQuestion.quizSection] ?? {};
    const isEditing = props[MNPQuizCreateQuestion.isEditing  ] ?? false;

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
        {isEditing && (
          <ModalSectionButton
            isDestructive={true}
            onPress={this._handleOnPressDelete}
            label={'Delete Question'}
            leftIcon={(
              <Ionicon
                style={{marginTop: 1}}
                name={'ios-trash'}
                size={24}
              />
            )}
          />
        )}
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};