import React, { Fragment } from 'react';
import { View, SectionList, Alert } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';

import { ModalBody           } from 'app/src/components/Modal/ModalBody';
import { ModalFooter         } from 'app/src/components/Modal/ModalFooter';
import { ModalOverlayCheck   } from 'app/src/components/Modal/ModalOverlayCheck';
import { ModalSectionHeader  } from 'app/src/components/Modal/ModalSectionHeader';
import { ModalFooterButton   } from 'app/src/components/Modal/ModalFooterButton';
import { ModalOverlayLoading } from 'app/src/components/Modal/ModalOverlayLoading';

import { ViewQuizDetails     } from 'app/src/components/ViewQuizModal/ViewQuizDetails';
import { ViewQuizSectionItem } from 'app/src/components/ViewQuizModal/ViewQuizSectionItem';

import { QuestionAnswerItem } from 'app/src/components/QuizSessionDoneModal/QuestionAnswerItem';
import { QuizSessionDetails } from 'app/src/components/QuizSessionDoneModal/QuizSessionDetails';

import { ListFooterIcon } from 'app/src/components/ListFooterIcon';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { MNPQuizSessionDoneModal } from 'app/src/constants/NavParams';
import { QuizSectionKeys, QuizKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { QuizSessionBookmarkModel } from '../models/QuizSessionBookmarkModel';


// QSD: QuizSessionDone 🤣
const QSDSectionTypes = {
  DETAILS  : 'DETAILS'  ,
  SESSION  : 'SESSION'  ,
  SECTIONS : 'SECTIONS' ,
  QUESTIONS: 'QUESTIONS',
};

// combine questions, answers and bookmarks
function combineItemsWithQuestions(questions, answers, bookmarks){
  return questions.map((question) => {
    const questionID = question[QuizQuestionKeys.questionID];

    return {
      type  : QSDSectionTypes.QUESTIONS,
      answer: answers [questionID],
      // pass down
      questionID, question,
    };
  });
};

export class QuizSessionDoneModal extends React.Component {
  constructor(props){
    super(props);

    const prevBookmarks = 
      props[MNPQuizSessionDoneModal.bookmarks] ?? {};

    const bookmarks = new QuizSessionBookmarkModel();
    bookmarks.setBookmarks(prevBookmarks);
    this.bookmarks = bookmarks;

    this.state = {
      sections   : this.getSections(),
      bookmarks  : bookmarks.bookmarkMap,
      updateIndex: 0,
    };
  };

  componentDidMount(){
    const { getModalRef } = this.props;
    if(getModalRef){
      // ModalView: receive modal ref
      this.modalRef = getModalRef();
    };
  };

  getSections = () => {
    const props = this.props;

    const quiz      = props[MNPQuizSessionDoneModal.quiz     ] ?? {};
    const answers   = props[MNPQuizSessionDoneModal.answers  ] ?? {};
    const questions = props[MNPQuizSessionDoneModal.questions] ?? [];
    
    const sections = quiz [QuizKeys.quizSections] ?? [];

    const questionAnswerData = 
      combineItemsWithQuestions(questions, answers);

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
      case QSDSectionTypes.DETAILS  :
      case QSDSectionTypes.SESSION  : return (`${type}-${index}`);
      case QSDSectionTypes.SECTIONS : return (item[QuizSectionKeys.sectionID]);
      case QSDSectionTypes.QUESTIONS: return (item?.questionID ?? index);
    };
  };

  _handleOnPressButtonLeft = async () => {
    const props = this.props;

    const confirm = await Helpers.asyncActionSheetConfirm({
      title: 'Are you done answering?',
      message: "Are you sure you want to save and end this quiz session? Your answers will be checked and saved.",
      confirmText: 'End Quiz',
      isDestructive: false,
    });

    if(confirm){
      const onPressDone = 
        props[MNPQuizSessionDoneModal.onPressDone];

      // disable swipe gesture
      this.modalRef.setIsModalInPresentation(true);

      await Promise.all([
        // wait for callback
        onPressDone && onPressDone(),
        // wait for overlay animation
        this.overlayCheck.start(1000),
        // wait for footer hide animation
        this.modalFooterRef.setVisibility(false),
      ]);

      //close modal
      this.modalRef.setVisibility(false);
    };
  };

  _handleOnPressButtonRight = async () => {
    await Helpers.timeout(200);
    //close modal
    this.modalRef.setVisibility(false);
  };

  _handleOnPressQuestion = async ({answer, question, index}) => {
    const props = this.props;

    const currentQuestion = props[MNPQuizSessionDoneModal.currentQuestion];
    const onPressQuestion = props[MNPQuizSessionDoneModal.onPressQuestion];

    const nextQuizID = question       [QuizQuestionKeys.questionID];
    const currQuizID = currentQuestion[QuizQuestionKeys.questionID];

    if(currQuizID != nextQuizID){
      // disable swipe gesture
      this.modalRef.setIsModalInPresentation(true);

      await Promise.all([
        // wait for show overlay
        this.overlayLoading.setVisibility(true),
        // wait for hide footer button
        this.modalFooterRef.setVisibility(false),
        // call and wait for question jump
        onPressQuestion && onPressQuestion({answer, question, index}),
      ]);
    };
    
    // close modal
    this.modalRef.setVisibility(false);
  };

  _handleOnLongPressQuestion = async ({question}) => {
    try {
      const props = this.props;
      let updateBookmarks = false;

      const questionID = question[QuizQuestionKeys.questionID];
      const prevBookmarks = this.bookmarks.bookmarkMap;

      const bookmark = prevBookmarks[questionID];
      const isBookmarked = (
        (bookmark != null     ) ||
        (bookmark != undefined)
      );

      if(isBookmarked){
        const confirm = await Helpers.asyncActionSheetConfirm({
          title: '',
          message: "Are you sure that you want to remove the bookmark for this question.",
          confirmText: 'Remove Bookmark',
          isDestructive: true,
        });

        if(confirm){
          this.bookmarks.removeBookmark(questionID);
          updateBookmarks = true;
        };

      } else {
        this.bookmarks.addBookmark(questionID);
        updateBookmarks = true;
      };

      if(updateBookmarks){
        const updateBookmarks = props[MNPQuizSessionDoneModal.updateBookmarks];
        // call updateBookmarks from QuizSessionScreen
        updateBookmarks && updateBookmarks(
          this.bookmarks.bookmarkMap
        );

        this.setState((prevState) => ({
          ...prevState,
          bookmarks  : this.bookmarks.bookmarkMap ,
          updateIndex: (prevState.updateIndex + 1),
        }));
      };

    } catch(error){
      console.log('_handleOnLongPressQuestion error - unable to bookmark');
      console.log(error);

      Alert.alert(
        'Error Occured',
        'Unable to bookmark question.',
      );
    };
  };

  // #region - render methods
  _renderSectionHeader = ({section}) => {
    switch (section.type) {
      case QSDSectionTypes.DETAILS: return (
        <ModalSectionHeader
          title={'Quiz Details'}
          subtitle={`Information about this quiz`}
          topOverflow={true}
          showTopBorder={false}
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

    const bookmarks  = this.bookmarks.bookmarkMap;
    const questionID = item?.question?.[QuizQuestionKeys.questionID];

    const quiz         = props[MNPQuizSessionDoneModal.quiz        ] ?? {};
    const session      = props[MNPQuizSessionDoneModal.session     ] ?? {};
    const answers      = props[MNPQuizSessionDoneModal.answers     ] ?? {};
    const questions    = props[MNPQuizSessionDoneModal.questions   ] ?? [];
    const currentIndex = props[MNPQuizSessionDoneModal.currentIndex] ?? -1;

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
          answer  ={item.answer  }
          question={item.question}
          bookmark={bookmarks[questionID]}
          onPressQuestion={this._handleOnPressQuestion}
          onLongPressQuestion={this._handleOnLongPressQuestion}
          {...{index, currentIndex}}
        />
      );
    };
  };
  
  render(){
    const state = this.state;

    const extraData = {
      bookmarks: state.bookmarks,
    };

    const modalFooter = (
      <ModalFooter ref={r => this.modalFooterRef = r}>
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
      <Fragment>
        <ModalOverlayLoading
          ref={r => this.overlayLoading = r}
        />
        <ModalOverlayCheck
          ref={r => this.overlayCheck = r}
        />
      </Fragment>
    );

    return (
      <ModalBody
        headerMode={'NONE'}
        delayMount={false}
        animateAsGroup={true}
        wrapInScrollView={false}
        {...{modalFooter, overlay}}
      >
        <SectionList
          ref={r => this.sectionList = r}
          sections={state.sections}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          SectionSeparatorComponent={this._renderSectionSeperator}
          ListFooterComponent={this._renderListFooter}
          {...{extraData}}
        />
      </ModalBody>
    );
  };
  //#endregion
};