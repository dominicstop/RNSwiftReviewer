import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon           from 'react-native-vector-icons/Ionicons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import { ModalBody           } from 'app/src/components/Modal/ModalBody';
import { ModalHeader         } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter         } from 'app/src/components/Modal/ModalFooter';
import { ModalFooterButton   } from 'app/src/components/Modal/ModalFooterButton';
import { ModalSection        } from 'app/src/components/Modal/ModalSection';
import { ModalSectionButton  } from 'app/src/components/Modal/ModalSectionButton';
import { ModalOverlayCheck   } from 'app/src/components/Modal/ModalOverlayCheck';
import { ModalSectionHeader  } from 'app/src/components/Modal/ModalSectionHeader';
import { ModalInputMultiline } from 'app/src/components/Modal/ModalInputMultiline';

import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';
import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';

import { SectionTrueOrFalse    } from 'app/src/components/QuizCreateQuestionModal/SectionTrueOrFalse';
import { SectionMatchingType   } from 'app/src/components/QuizCreateQuestionModal/SectionMatchingType';
import { SectionMultipleChoice } from 'app/src/components/QuizCreateQuestionModal/SectionMultipleChoice';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { MNPQuizCreateQuestion } from 'app/src/constants/NavParams';
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

  componentDidMount(){
    const { getModalRef } = this.props;
    if(getModalRef){
      // ModalView: receive modal ref
      this.modalRef = getModalRef();
    };
  };

  // ModalView: isModalInPresentation event
  onModalAttemptDismiss = async () => {
    const hasChanges = this.hasUnsavedChanges();

    if (!hasChanges) return;
    const shouldDiscard = await Helpers.asyncActionSheetConfirm({
      title        : 'Discard Changes',
      message      : 'Looks like you have some unsaved changes, are you sure you want to discard them?',
      confirmText  : 'Discard',
      isDestructive: true,
    });

    if(shouldDiscard){
      this.modalRef.setVisibility(false);
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
        this.question.answer  = selectedChoice;
        this.question.choices = choices;
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

  _handleOnChangeValue = () => {
    this.modalRef.setIsModalInPresentation(
      this.hasUnsavedChanges()
    );
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
    this.modalRef.setVisibility(false);
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
      this.modalRef.setVisibility(false);

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
      this.modalRef.setVisibility(false);
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
    this.modalRef.setVisibility(false);
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
            onChangeValue={this._handleOnChangeValue}
            validate={Validate.isNotNullOrWhitespace}
          />
        </ModalSection>
      );
      case SectionTypes.MULTIPLE_CHOICE: return (
        <SectionMultipleChoice
          ref={r => this.multipleChoiceRef = r}
          selectedChoices={answer}
          onChangeValue={this._handleOnChangeValue}
          {...{choices}}
        />
      );
      case SectionTypes.TRUE_OR_FALSE: return (
        <SectionTrueOrFalse
          ref={r => this.trueOrFalseRef = r}
          onChangeValue={this._handleOnChangeValue}
          initialValue={answer}
        />
      );
      case SectionTypes.MATCHING_TYPE: return(
        <SectionMatchingType
          ref={r => this.matchingTypeRef = r}
          onChangeValue={this._handleOnChangeValue}
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
      <ModalBody
        stickyHeaderIndices={[0, 1, 3]}
        useKeyboardSpacer={true}
        animateAsGroup={true}
        {...{modalHeader, modalFooter, overlay}}
      >
        <ModalSection 
          showBorderTop={false}
          extraPaddingTop={true}
        >
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
            onChangeValue={this._handleOnChangeValue}
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
      </ModalBody>
    );
  };
};