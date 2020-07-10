import React, { Fragment } from 'react';
import { StyleSheet, SectionList } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import { createNativeWrapper } from 'react-native-gesture-handler';

import { ModalBody                  } from 'app/src/components/Modal/ModalBody';
import { ModalHeader                } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter                } from 'app/src/components/Modal/ModalFooter';
import { ModalFooterButton          } from 'app/src/components/Modal/ModalFooterButton';
import { ModalOverlayCheck          } from 'app/src/components/Modal/ModalOverlayCheck';
import { ModalSectionHeader         } from 'app/src/components/Modal/ModalSectionHeader';
import { ModalSectionButton         } from 'app/src/components/Modal/ModalSectionButton';
import { ModalHeaderRightTextButton } from 'app/src/components/Modal/ModalHeaderRightTextButton';

import { QuizAddQuestionModalItem   } from 'app/src/components/QuizAddQuestionModalItem';
import { QuizAddQuestionModalHeader } from 'app/src/components/QuizAddQuestionModalHeader';

import { ModalView } from 'app/src/components_native/ModalView';
import { QuizCreateQuestionModal      } from 'app/src/modals/QuizCreateQuestionModal';
import { QuizAddQuestionEditListModal } from 'app/src/modals/QuizAddQuestionEditListModal';

import { RNN_ROUTES } from 'app/src/constants/Routes';
import { MNPQuizAddQuestion, MNPQuizCreateQuestion, MNPQuizAddQuestionEditList } from 'app/src/constants/NavParams';
import { QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

import { QuizSectionModel } from 'app/src/models/QuizSectionModel';


const GHSectionList = createNativeWrapper(SectionList);


// TODO:
// [ ] - Imp. footer icon

function didChangeQuestions(prevQuestions = [], nextQuestions = []){
  const prevQuestionsCount = (prevQuestions?.length ?? 0);
  const nextQuestionsCount = (nextQuestions?.length ?? 0);

  const didChangeCount = (prevQuestionsCount != nextQuestionsCount);
  if(didChangeCount) return true;

  for (let index = 0; index < prevQuestionsCount; index++) {
    const prevQuestionItem = prevQuestions[index];
    const nextQuestionItem = nextQuestions[index];
    
    const prevQuestionID      = prevQuestionItem[QuizQuestionKeys.questionID];
    const prevQuestionText    = prevQuestionItem[QuizQuestionKeys.questionText];
    const prevQuestionAnswer  = prevQuestionItem[QuizQuestionKeys.questionAnswer];
    const prevQuestionChoices = prevQuestionItem[QuizQuestionKeys.questionChoices];
    const prevQuestionCreated = prevQuestionItem[QuizQuestionKeys.questionDateCreated];
    
    const nextQuestionID      = prevQuestionItem[QuizQuestionKeys.questionID];
    const nextQuestionText    = nextQuestionItem[QuizQuestionKeys.questionText];
    const nextQuestionAnswer  = nextQuestionItem[QuizQuestionKeys.questionAnswer];
    const nextQuestionChoices = prevQuestionItem[QuizQuestionKeys.questionChoices];
    const nextQuestionCreated = nextQuestionItem[QuizQuestionKeys.questionDateCreated];

    const didChange = (
      prevQuestionID      != nextQuestionID      ||
      prevQuestionText    != nextQuestionText    ||
      prevQuestionAnswer  != nextQuestionAnswer  ||
      prevQuestionChoices != nextQuestionChoices ||
      prevQuestionCreated != nextQuestionCreated
    );
    
    // question change, early return
    if(didChange) return true;
  };

  // no changes
  return false;
};

export class QuizAddQuestionModal extends React.Component {
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

    // get section from nav props
    const section = props[MNPQuizAddQuestion.quizSection];
    this.quizSection = new QuizSectionModel(section);

    this.state = {
      ...this.quizSection.values,
    };
  };

  componentDidMount(){
    const { getModalRef } = this.props;
    if(getModalRef){
      // ModalView: receive modal ref
      this.modalRef = getModalRef();
    };
  };

  hasUnsavedChanges = () => {
    const props = this.props;
    const state = this.state;

    const prevSection = props[MNPQuizAddQuestion.quizSection];

    const prevQuestions     = prevSection[QuizSectionKeys.sectionQuestions];
    const prevQuestionCount = prevSection[QuizSectionKeys.sectionQuestionCount];

    const nextQuestions     = state[QuizSectionKeys.sectionQuestions];
    const nextQuestionCount = state[QuizSectionKeys.sectionQuestionCount];

    const isEditing  = (prevQuestionCount == 0);

    return (isEditing? (
      (prevQuestionCount != nextQuestionCount) ||
      didChangeQuestions(prevQuestions, nextQuestions)
    ):(
      (nextQuestionCount > 0)
    ));
  };

  // #region - event handlers/callbacks
  // SectionList: item keyExtractor
  _handleKeyExtractor = (question, index) => {
    return question[QuizQuestionKeys.questionID];
  };

  // Add New Question button press
  _handleOnPressAddNewQuestion = () => {
    const state = this.state;
    
    // extract/isolate section values from stata
    const section = QuizSectionModel.extract(state);

    this.modalViewCreateQuestionRef.setVisibility(true, {
      [MNPQuizCreateQuestion.isEditing   ]: false,
      [MNPQuizCreateQuestion.quizSection ]: section,
      [MNPQuizCreateQuestion.quizQuestion]: {},
      [MNPQuizCreateQuestion.onPressDone ]: this._handleQuizCreateQuestionModalOnPressCreate,
    });
  };

  // QuizAddQuestionModalItem: item onPress - open modal
  _handleOnPressQuestionItem = ({question}) => {
    const state = this.state;

    // extract/isolate section values from stata
    const section = QuizSectionModel.extract(state);

    // open QuizCreateQuestionModal
    this.modalViewCreateQuestionRef.setVisibility(true, {
      [MNPQuizCreateQuestion.isEditing    ]: true,
      [MNPQuizCreateQuestion.quizSection  ]: section,
      [MNPQuizCreateQuestion.quizQuestion ]: question,
      [MNPQuizCreateQuestion.onPressDone  ]: this._handleQuizCreateQuestionModalOnPressEdit  ,
      [MNPQuizCreateQuestion.onPressDelete]: this._handleQuizCreateQuestionModalOnPressDelete,
    });
  };

  // QuizAddQuestionModalItem: item onPress delete
  _handleOnPressQuestionDelete = async ({question}) => {
    const prevSection = this.state;
    const animatedRef = this.modalBgRef.animatedWrapperRef;

    this.quizSection.deleteQuestion(question);
    const nextSection = this.quizSection.values;

    const prevQuestionCount = prevSection[QuizSectionKeys.sectionQuestionCount];
    const nextQuestionCount = nextSection[QuizSectionKeys.sectionQuestionCount];

    if(prevQuestionCount == 1, nextQuestionCount == 0){
      // fade out first
      animatedRef && await animatedRef.fadeScaleOut(250);
      // then update the list
      await Helpers.setStateAsync(this, { ...nextSection });
      // and then fade in again
      animatedRef && await animatedRef.fadeScaleIn(250);

    } else {
      this.setState({
        ...nextSection
      });
    };
  };
  //#endregion

  // #region - modal handlers/callbacks
  // ModalView Event/Lifecycle
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

  //ModalHeader: edit button
  _handleOnPressHeaderEdit = () => {
    this.modalViewEditListRef.setVisibility(true, {
      [MNPQuizAddQuestionEditList.quizSection]: {...this.quizSection.values},
      [MNPQuizAddQuestionEditList.onPressDone]: this._handleEditListModalOnPressDone,
    });
  };

  // ModalFooter: save button
  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;
    const hasChanges = this.hasUnsavedChanges();

    const onPressDone = props[MNPQuizAddQuestion.onPressDone];

    if(hasChanges){
      // trigger callback event
      onPressDone && onPressDone({
        section: this.quizSection.values,
      });

      // show check overlay
      await this.overlay.start();
    };

    // close modal
    this.modalRef.setVisibility(false);
  };

  // ModalFooter: cancel button
  _handleOnPressButtonRight = async () => {
    const didChange = this.hasUnsavedChanges();
    await Helpers.timeout(200);

    if(didChange){
      const shouldDiscard = await Helpers.asyncActionSheetConfirm({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard all of your changes?',
        confirmText: 'Discard',
        isDestructive: true,
      });

      // early exit if cancel
      if(!shouldDiscard) return;
    };
    
    // close modal
    this.modalRef.setVisibility(false);
  };

  // QuizAddQuestionEditListModal: confirm changes
  _handleEditListModalOnPressDone = ({quizSection}) => {
    this.setState({ ...quizSection });
  };

  // QuizCreateQuestionModal - isEditing: false
  // ModalFooterButton: onPressDone callback
  _handleQuizCreateQuestionModalOnPressCreate = ({question}) => {
    this.quizSection.addQuestion(question);

    this.setState({
      ...this.quizSection.values,
    });
  };

  // QuizCreateQuestionModal - isEditing: true
  // ModalFooterButton: onPressDone callback
  _handleQuizCreateQuestionModalOnPressEdit = ({question}) => {
    this.quizSection.updateQuestion(question);
    this.setState({
      ...this.quizSection.values,
    });
  };

  // QuizCreateQuestionModal - isEditing: true
  // ModalSectionButton: onPress delete callback
  _handleQuizCreateQuestionModalOnPressDelete = ({question}) => {
    this.quizSection.deleteQuestion(question);

    this.setState({
      ...this.quizSection.values
    });
  };
  //#endregion

  // #region - render functions
  _renderModals(){
    return(
      <Fragment>
        <ModalView
          ref={r => this.modalViewCreateQuestionRef = r}
          setModalInPresentationFromProps={true}
        >
          <QuizCreateQuestionModal/>
        </ModalView>
        <ModalView
          ref={r => this.modalViewEditListRef = r}
          setModalInPresentationFromProps={true}
        >
          <QuizAddQuestionEditListModal/>
        </ModalView>
      </Fragment>
    );
  };

  // SectionList: top header
  _renderListHeader = () => {
    const section = QuizSectionModel.extract(this.state);

    return (
      <QuizAddQuestionModalHeader
        onPressAddSection={this._handleOnPressAddNewQuestion}
        {...section}
      />
    );
  };

  // SectionList: bottom footer
  _renderListFooter = () => {
    const state = this.state;

    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];
    const count     = questions.length;

    if(count <= 0) return null;

    return (
      <ModalSectionButton
        containerStyle={{marginTop: 20}}
        onPress={this._handleOnPressAddNewQuestion}
        isDestructive={false}
        label={'Insert Question'}
        leftIcon={(
          <Ionicon
            style={{marginTop: 2}}
            name={'ios-add-circle'}
            size={21}
          />
        )}
      />
    );
  };

  // SectionList: sticky header
  _renderSectionHeader = ({section}) => {
    const state = this.state;

    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];
    const count     = questions.length

    if(count == 0) return null;

    return(
      <ModalSectionHeader
        title={'Questions'}
        subtitle={`Currently showing ${count} ${Helpers.plural('item', count)}`}
        titleIcon={(
          <Ionicon
            name={'ios-bookmarks'}
            size={24}
          />
        )}
      />
    );
  };

  // SectionList: render questions
  _renderItem = ({item: question, index}) => {
    const state = this.state;
    
    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];
    const isLast    = (index == (questions.length - 1));

    return (
      <QuizAddQuestionModalItem
        onPressQuestionItem={this._handleOnPressQuestionItem}
        onPressDelete={this._handleOnPressQuestionDelete}
        {...{index, isLast, ...question}}
      />
    );
  };

  render(){
    const state = this.state;
    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];

    const modalHeader = (
      <ModalHeader
        title={'Add Questions'}
        subtitle={"Add/Edit this section's questions"}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-journal'}
            size={22}
          />
        )}
        rightHeaderItem={(
          <ModalHeaderRightTextButton
            delay={1250}
            text={'Edit'}
            visible={(questions.length > 0)}
            onPress={this._handleOnPressHeaderEdit}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonLeftTitle={'Save'}
          buttonLeftSubtitle={'Confirm changes'}
          buttonRightSubtitle={'Discard Changes'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    const overlay = (
      <ModalOverlayCheck
        ref={r => this.overlay = r}
      />
    );

    return (
      <Fragment>
        {this._renderModals()}
        <ModalBody
          ref={r => this.modalBgRef = r}
          wrapInScrollView={false}
          {...{modalHeader, modalFooter, overlay}}
        >
          <GHSectionList
            ref={r => this.sectionList = r}
            sections={[{ data: questions }]}
            keyExtractor={this._handleKeyExtractor}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            ListHeaderComponent={this._renderListHeader}
            ListFooterComponent={this._renderListFooter}
          />
        </ModalBody>
      </Fragment>
    );
  };
  //#endregion
};
