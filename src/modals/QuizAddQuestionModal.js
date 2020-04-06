import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { Navigation } from 'react-native-navigation';
import { createNativeWrapper } from 'react-native-gesture-handler';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalSectionHeader } from 'app/src/components/ModalSectionHeader';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';
import { ModalOverlayCheck  } from 'app/src/components/ModalOverlayCheck';
import { ModalSectionButton } from 'app/src/components/ModalSectionButton';

import { QuizAddQuestionModalHeader } from 'app/src/components/QuizAddQuestionModalHeader';
import { QuizAddQuestionModalItem   } from 'app/src/components/QuizAddQuestionModalItem';

import { RNN_ROUTES } from 'app/src/constants/Routes';
import { MNPQuizAddQuestion, MNPQuizCreateQuestion } from 'app/src/constants/NavParams';
import { QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';
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

  hasUnsavedChanges = () => {
    const props = this.props;
    const state = this.state;

    const isEditing   = props[MNPQuizAddQuestion.isEditing];
    const prevSection = props[MNPQuizAddQuestion.quizSection];

    const prevQuestions     = prevSection[QuizSectionKeys.sectionQuestions];
    const prevQuestionCount = prevSection[QuizSectionKeys.sectionQuestionCount];

    const nextQuestions     = state[QuizSectionKeys.sectionQuestions];
    const nextQuestionCount = state[QuizSectionKeys.sectionQuestionCount];

    return (isEditing? (
      (prevQuestionCount != nextQuestionCount) ||
      didChangeQuestions(prevQuestions, nextQuestions)
    ):(
      (nextQuestionCount > 0)
    ));
  };

  _handleKeyExtractor = (question, index) => {
    return question[QuizQuestionKeys.questionID];
  };

  // ModalFooter: save button
  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;

    const onPressDone = props[MNPQuizAddQuestion.onPressDone];

    // trigger callback event
    onPressDone && onPressDone({
      section: this.quizSection.values,
    });

    // show check overlay
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

      // early exit if cancel
      if(!shouldDiscard) return;
    };
    
    //close modal
    Navigation.dismissModal(componentId);
  };

  // Add New Question button press
  _handleOnPressAddNewQuestion = () => {
    const state = this.state;
    
    // extract/isolate section values from stata
    const section = QuizSectionModel.extract(state);

    // open QuizCreateQuestionModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizCreateQuestion,
      navProps: {
        [MNPQuizCreateQuestion.isEditing   ]: false,
        [MNPQuizCreateQuestion.quizSection ]: section,
        [MNPQuizCreateQuestion.quizQuestion]: {},
        [MNPQuizCreateQuestion.onPressDone ]: this._handleOnPressCreateQuizCreateQuestionModal,
      },
    });
  };

  // QuizAddQuestionModalItem: item onPress - open modal
  _handleOnPressQuestionItem = ({question}) => {
    const state = this.state;

    // extract/isolate section values from stata
    const section = QuizSectionModel.extract(state);

    // open QuizCreateQuestionModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizCreateQuestion,
      navProps: {
        [MNPQuizCreateQuestion.isEditing   ]: true,
        [MNPQuizCreateQuestion.quizSection ]: section,
        [MNPQuizCreateQuestion.quizQuestion]: question,
        [MNPQuizCreateQuestion.onPressDone ]: this._handleOnPressEditQuizCreateQuestionModal,
      },
    });
  };

  _handleOnPressQuestionDelete = ({question}) => {
    this.quizSection.deleteQuestion(question);

    this.setState({
      ...this.quizSection.values
    });
  };

  // Modal - QuizCreateQuestionModal: onPressDone - isEditing: false
  _handleOnPressCreateQuizCreateQuestionModal = ({question}) => {
    this.quizSection.addQuestion(question);

    this.setState({
      ...this.quizSection.values,
    });
  };

  // Modal - QuizCreateQuestionModal: onPressDone - isEditing: true
  _handleOnPressEditQuizCreateQuestionModal = ({question}) => {
    this.quizSection.updateQuestion(question);
    this.setState({
      ...this.quizSection.values,
    });
  };

  _renderListHeader = () => {
    const section = QuizSectionModel.extract(this.state);

    return (
      <QuizAddQuestionModalHeader
        onPressAddSection={this._handleOnPressAddNewQuestion}
        {...section}
      />
    );
  };

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
            style={{marginTop: 1}}
            name={'ios-add-circle'}
            size={21}
          />
        )}
      />
    );
  };

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
            name={'ios-bookmarks'}
            size={24}
            color={'white'}
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
      <ModalBackground
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
      </ModalBackground>
    );
  };
};
