import React, { Fragment } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';

import { ModalBody          } from 'app/src/components/Modal/ModalBody';
import { ModalHeader        } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter        } from 'app/src/components/Modal/ModalFooter';
import { ModalSectionHeader } from 'app/src/components/Modal/ModalSectionHeader';
import { ModalSectionButton } from 'app/src/components/Modal/ModalSectionButton';
import { ModalFooterButton  } from 'app/src/components/Modal/ModalFooterButton';

import { ViewQuizOverlay     } from 'app/src/components/ViewQuizModal/ViewQuizOverlay';
import { ViewQuizDetails     } from 'app/src/components/ViewQuizModal/ViewQuizDetails';
import { ViewQuizSectionItem } from 'app/src/components/ViewQuizModal/ViewQuizSectionItem';
import { ViewQuizSessionItem } from 'app/src/components/ViewQuizModal/ViewQuizSessionItem';

import { ListFooterIcon } from 'app/src/components/ListFooterIcon';

import { ROUTES } from 'app/src/constants/Routes';

import { MNPViewQuiz, SNPQuizSession } from 'app/src/constants/NavParams';
import { QuizKeys, QuizSectionKeys, QuizSessionKeys } from 'app/src/constants/PropKeys';

import * as Helpers from 'app/src/functions/helpers';


// VQM: ViewQuizModal 🤣
const VQMSectionTypes = {
  DETAILS : 'DETAILS' ,
  SECTIONS: 'SECTIONS',
  SESSIONS : 'SESSIONS' ,
};


// Since it isn't recc to wrap a VirtualizedList inside a scrollview
// this modal is using SectionList to emulate scrollview + flatlist.
// Replace w/ custom VirtualizedList impl.

export class ViewQuizModal extends React.Component {
  static styles = StyleSheet.create({
  });

  componentDidMount(){
    const { getModalRef } = this.props;
    if(getModalRef){
      // ModalView: receive modal ref
      this.modalRef = getModalRef();
    };
  };

  getSections = () => {
    const props = this.props;

    const quiz     = props[MNPViewQuiz.quiz     ] ?? {};
    const sessions = props[MNPViewQuiz.sessions ] ?? [];
    const sections = quiz [QuizKeys.quizSections] ?? [];

    const detailsData = [
      { type: VQMSectionTypes.DETAILS }
    ];

    const sectionData = sections.map(section =>
      ({type: VQMSectionTypes.SECTIONS, section})
    );

    const sessionData = ((sessions.length == 0)
      ? [{ type: VQMSectionTypes.SESSIONS, isEmpty: true }]
      : sessions.map(session => (
        ({ type: VQMSectionTypes.SESSIONS, session })
      ))
    );

    return ([
      { type: VQMSectionTypes.DETAILS , data: detailsData },
      { type: VQMSectionTypes.SECTIONS, data: sectionData },
      { type: VQMSectionTypes.SESSIONS, data: sessionData },
    ]);
  };

  _handleKeyExtractor = (item, index) => {
    const type = item.type;

    switch (type) {
      case VQMSectionTypes.DETAILS : return (`${type}-${index}`);
      case VQMSectionTypes.SECTIONS: return (item?.section?.[QuizSectionKeys.sectionID] ?? `${type}-${index}`);
      case VQMSectionTypes.SESSIONS: return (item?.session?.[QuizSessionKeys.sessionID] ?? `${type}-${index}`);
    };
  };

  _handleOnPressDelete = async () => {
    const props = this.props;

    const quiz     = props[MNPViewQuiz.quiz] ?? {};
    const callback = props[MNPViewQuiz.onPressDeleteQuiz];

    const quizTitle = quiz[QuizKeys.quizTitle];

    const confirm = await Helpers.asyncActionSheetConfirm({
      title: `Delete this Quiz?`,
      message: "Are you sure you want to delete this quiz?",
      confirmText: 'Delete',
      isDestructive: true,
    });

    if(confirm){
      await Promise.all([
        this.overlayRef.show(),
        // wait for delete to finish
        callback && callback(quiz),
        // wait at least 1 sec
        Helpers.timeout(1000),
      ]);

      // close modal
      this.modalRef.setVisibility(false);
      await Helpers.asyncAlert({
        title: 'Quiz Deleted',
        desc : `${quizTitle} has been deleted.`,
      });
    };
  };

  _handleOnPressCloseModal = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTES.appStackRoute);
  };

  // ModalFooter: onPress "Start Quiz" button
  _handleOnPressButtonLeft = async () => {
    const { navigation, ...props } = this.props;

    const quiz = props[MNPViewQuiz.quiz];
    const onPressStartQuiz = props[MNPViewQuiz.onPressStartQuiz];
    
    // disable swipe gesture
    this.modalRef.setIsModalInPresentation(true);

    // call callback
    onPressStartQuiz && onPressStartQuiz({quiz});
    // navigate to QuizSessonScreen
    navigation.navigate(ROUTES.quizSessionRoute, {
      [SNPQuizSession.quiz]: quiz,
    });

    await Promise.all([
      Helpers.timeout(1000),
      this.overlayRef.show(),
      this.modalFooterRef.setVisibility(false)
    ]);

    //close modal
    this.modalRef.setVisibility(false);
  };

  // ModalFooter: onPress "cancel" button
  _handleOnPressButtonRight = () => {
    //close modal
    this.modalRef.setVisibility(false);
  };

  // #region - render methods
  _renderSectionHeader = ({section}) => {
    switch (section.type) {
      case VQMSectionTypes.DETAILS: return (
        <ModalSectionHeader
          title={'Quiz Details'}
          subtitle={`Information about this quiz`}
          // diff style bc it's first
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
      case VQMSectionTypes.SECTIONS: return (
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
      case VQMSectionTypes.SESSIONS: return (
        <ModalSectionHeader
          title={'Quiz Sessions'}
          subtitle={`Your previous session history`}
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
    if(data?.trailingItem) return null;

    return(
      <View style={{marginBottom: 20}}/>
    );
  };

  _renderListFooter = () => {
    return(
      <Fragment>
        <ModalSectionButton
          isDestructive={true}
          onPress={this._handleOnPressDelete}
          label={'Delete Quiz'}
          leftIcon={(
            <Ionicon
              style={{marginTop: 1}}
              name={'ios-trash'}
              size={24}
            />
          )}
        />
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
    const quiz  = props[MNPViewQuiz.quiz] ?? {};

    switch (section.type) {
      case VQMSectionTypes.DETAILS: return (
        <ViewQuizDetails
          {...{quiz}}
        />
      );
      case VQMSectionTypes.SECTIONS: return (
        <ViewQuizSectionItem
          section={item.section}
          {...{index}}
        />
      );
      case VQMSectionTypes.SESSIONS: return (
        <ViewQuizSessionItem
          isEmpty={item.isEmpty}
          session={item.session}
          {...{index}}
        />
      );
    };
  };

  render(){
    const { styles } = ViewQuizModal;
    const sections = this.getSections();

    const modalHeader = (
      <ModalHeader
        title={'View Quiz'}
        subtitle={"Press the \"Start Quiz\" to take this quiz."}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-book'}
            size={24}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter ref={r => this.modalFooterRef = r}>
        <ModalFooterButton
          buttonLeftTitle={'Start Quiz'}
          buttonLeftSubtitle={'New Session'}
          buttonRightSubtitle={'Close this modal'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    const overlay = (
      <ViewQuizOverlay
        ref={r => this.overlayRef = r}
      />
    );

    return (
      <ModalBody
        headerMode={'NONE'}
        wrapInScrollView={false}
        delayMount={false}
        passScrollviewProps={true}
        {...{modalHeader, modalFooter, overlay}}
      >
        <SectionList
          ref={r => this.sectionList = r}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          SectionSeparatorComponent={this._renderSectionSeperator}
          ListFooterComponent={this._renderListFooter}
          {...{sections}}
        />
      </ModalBody>
    );
  };
  // #endregion
};