import React, { Fragment } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Ionicon from '@expo/vector-icons/Ionicons';

import { iOSUIKit   } from 'react-native-typography';
import { Navigation } from 'react-native-navigation';

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalSectionHeader } from 'app/src/components/ModalSectionHeader';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';
import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';

import { ViewQuizDetails     } from 'app/src/components/ViewQuizModal/ViewQuizDetails';
import { ViewQuizSectionItem } from 'app/src/components/ViewQuizModal/ViewQuizSectionItem';

import { QuestionAnswerItem     } from 'app/src/components/QuizSessionDoneModal/QuestionAnswerItem';
import { QuizSessionDoneOverlay } from 'app/src/components/QuizSessionDoneModal/QuizSessionDoneOverlay';


import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { QuizSectionKeys, QuizKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { MNPQuizSessionDoneModal } from 'app/src/constants/NavParams';
import { QuizSessionDetails } from '../components/QuizSessionDoneModal/QuizSessionDetails';

// QSD: QuizSessionDone 🤣
const QSDSectionTypes = {
  DETAILS  : 'DETAILS'  ,
  SESSION  : 'SESSION'  ,
  SECTIONS : 'SECTIONS' ,
  QUESTIONS: 'QUESTIONS',
};

function combineQuestionsAndAnswers(questions, answers){
  return questions.map((question) => {
    const questionID = question[QuizQuestionKeys.questionID];

    return {
      questionID, question,
      type  : QSDSectionTypes.QUESTIONS,
      answer: answers[questionID],
    };
  });
};

export class QuizSessionDoneModal extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sections: this.getSections(),
    };
  };

  getSections = () => {
    const props = this.props;

    const quiz      = props[MNPQuizSessionDoneModal.quiz] ?? {};
    const answers   = props[MNPQuizSessionDoneModal.answers  ] ?? {};
    const questions = props[MNPQuizSessionDoneModal.questions] ?? [];
    
    const sections = quiz [QuizKeys.quizSections] ?? [];

    const questionAnswerData = 
      combineQuestionsAndAnswers(questions, answers);

    const detailsData = [
      { type: QSDSectionTypes.DETAILS }
    ];

    const sessionData = [
      { type: QSDSectionTypes.SESSION }
    ];

    const sectionData = sections.map(section =>
      ({type: QSDSectionTypes.SECTIONS, ...section})
    );

    return ([
      { type: QSDSectionTypes.DETAILS  , data: detailsData },
      { type: QSDSectionTypes.SESSION  , data: sessionData },
      { type: QSDSectionTypes.SECTIONS , data: sectionData },
      { type: QSDSectionTypes.QUESTIONS, data: questionAnswerData },
    ]);
  };

  _handleKeyExtractor = (item, index) => {
    const type = item.type;

    switch (type) {
      case QSDSectionTypes.DETAILS  : return (`${type}-${index}`);
      case QSDSectionTypes.SESSION  : return (`${type}-${index}`);
      case QSDSectionTypes.SECTIONS : return (item[QuizSectionKeys.sectionID]);
      case QSDSectionTypes.QUESTIONS: return (item?.questionID ?? index);
    };
  };

  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;

    const confirm = await Helpers.asyncActionSheetConfirm({
      title: 'Are you done answering?',
      message: "Are you sure you want to save and end this quiz session? Your answers will be checked and saved.",
      confirmText: 'End Quiz',
      isDestructive: false,
    });

    if(confirm){
      const onPressDone = props[MNPQuizSessionDoneModal.onPressDone];
      onPressDone && onPressDone();

      await Helpers.timeout(200);
      //close modal
      Navigation.dismissModal(componentId);
    };
  };

  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    await Helpers.timeout(200);
    //close modal
    Navigation.dismissModal(componentId);
  };

  _handleOnPressQuestion = async ({answer, question, index}) => {
    const { componentId, ...props } = this.props;
    const onPressQuestion = props[MNPQuizSessionDoneModal.onPressQuestion];

    await Promise.all([
      Helpers.timeout(500),
      this.overlay.show(),
      onPressQuestion && onPressQuestion({answer, question, index}),
    ]);

    // close modal
    Navigation.dismissModal(componentId);
  };

  // #region - render methods
  _renderSectionHeader = ({section}) => {
    switch (section.type) {
      case QSDSectionTypes.DETAILS: return (
        <ModalSectionHeader
          title={'Quiz Details'}
          subtitle={`Information about this quiz`}
          titleIcon={(
            <Ionicon
              name={'ios-bookmarks'}
              size={25}
            />
          )}
        />
      );
      case QSDSectionTypes.SESSION: return (
        <ModalSectionHeader
          title={'Session Details'}
          subtitle={`Information about this session`}
          titleIcon={(
            <Ionicon
              name={'ios-paper'}
              size={25}
            />
          )}
        />
      );
      case QSDSectionTypes.SECTIONS: return (
        <ModalSectionHeader
          title={'Quiz Sections'}
          subtitle={`Sections inside this quiz`}
          titleIcon={(
            <Ionicon
              name={'ios-journal'}
              size={25}
            />
          )}
        />
      );
      case QSDSectionTypes.QUESTIONS: return (
        <ModalSectionHeader
          title={'Questions & Answers'}
          subtitle={'Tap on an item to jump to that question'}
          titleIcon={(
            <Ionicon
              name={'ios-albums'}
              size={25}
            />
          )}
        />
      );
    };
  };

  _renderSectionSeperator = (data) => {
    if(data.trailingItem) return null;

    return(
      <View style={{marginBottom: 20}}/>
    );
  };

  _renderListFooter = () => {
    return(
      <Fragment>
        <ListFooterIcon
          ref={r => this.listFooterIconRef = r}
          show={true}
          hasEntranceAnimation={true}
        />
      </Fragment>
    );
  };

  _renderItem = ({item, index, section}) => {
    const props = this.props;

    const quiz          = props[MNPQuizSessionDoneModal.quiz        ] ?? {};
    const session       = props[MNPQuizSessionDoneModal.session     ] ?? {};
    const answers       = props[MNPQuizSessionDoneModal.answers     ] ?? {};
    const questions     = props[MNPQuizSessionDoneModal.questions   ] ?? [];
    const currentIndex  = props[MNPQuizSessionDoneModal.currentIndex];

    switch (section.type) {
      case QSDSectionTypes.DETAILS: return (
        <ViewQuizDetails
          {...{quiz}}
        />
      );
      case QSDSectionTypes.SESSION: return (
        <QuizSessionDetails
          {...{quiz, session, answers, questions}}
        />
      );
      case QSDSectionTypes.SECTIONS: return (
        <ViewQuizSectionItem
          section={item}
          {...{index}}
        />
      );
      case QSDSectionTypes.QUESTIONS: return (
        <QuestionAnswerItem
          onPressQuestion={this._handleOnPressQuestion}
          question={item.question}
          answer={item.answer}
          {...{index, currentIndex}}
        />
      );
    };
  };
  
  render(){
    const state = this.state;

    const modalHeader = (
      <ModalHeader
        title={'Quiz Session'}
        subtitle={`Press "End Session" when you're done`}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-book'}
            size={24}
            color={'white'}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonLeftTitle={'End Session'}
          buttonLeftSubtitle={'Save & end quiz'}
          buttonRightSubtitle={'Close this modal'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    const overlay = (
      <QuizSessionDoneOverlay
        ref={r => this.overlay = r}
      />
    );

    return (
      <ModalBackground
        wrapInScrollView={false}
        animateAsGroup={true}
        {...{modalHeader, modalFooter, overlay}}
      >
        <SectionList
          ref={r => this.sectionList = r}
          sections={state.sections}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          SectionSeparatorComponent={this._renderSectionSeperator}
          ListFooterComponent={this._renderListFooter}
        />
      </ModalBackground>
    );
  };
  //#endregion
};