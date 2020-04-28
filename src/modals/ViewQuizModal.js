import React, { Fragment } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { Navigation } from 'react-native-navigation';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalSectionHeader } from 'app/src/components/ModalSectionHeader';
import { ModalSectionButton } from 'app/src/components/ModalSectionButton';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';
import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';

import { ViewQuizOverlay     } from 'app/src/components/ViewQuizModal/ViewQuizOverlay';
import { ViewQuizDetails     } from 'app/src/components/ViewQuizModal/ViewQuizDetails';
import { ViewQuizSectionItem } from 'app/src/components/ViewQuizModal/ViewQuizSectionItem';
import { ViewQuizSessionItem } from 'app/src/components/ViewQuizModal/ViewQuizSessionItem';

import { ROUTES } from 'app/src/constants/Routes';

import { QuizKeys, QuizSectionKeys   } from 'app/src/constants/PropKeys';
import { MNPViewQuiz, SNPQuizSession } from 'app/src/constants/NavParams';

import * as Helpers from 'app/src/functions/helpers';

// VQM: ViewQuizModal 🤣
const VQMSectionTypes = {
  DETAILS : 'DETAILS' ,
  SECTIONS: 'SECTIONS',
  SESSION : 'SESSION' ,
};

// Since it isn't recc to wrap a VirtualizedList inside a scrollview
// this modal is using SectionList to emulate scrollview + flatlist.
// Replace w/ custom VirtualizedList impl.


export class ViewQuizModal extends React.Component {
  static options() {
    return {
    };
  };

  static styles = StyleSheet.create({
  });

  getSections = () => {
    const props = this.props;

    const quiz     = props[MNPViewQuiz.quiz     ] ?? {};
    const sections = quiz [QuizKeys.quizSections] ?? [];
    const sessions = []; // todo: impl.

    const detailsData = [
      { type: VQMSectionTypes.DETAILS }
    ];

    const sectionData = sections.map(section =>
      ({type: VQMSectionTypes.SECTIONS, ...section})
    );

    const sessionData = ((sessions.length == 0)
      ? [{ type: VQMSectionTypes.SESSION, isEmptyCard: true }]
      : sessions.map(sesssion => (
        ({ type: VQMSectionTypes.SESSION, ...sesssion })
      ))
    );

    return ([
      { type: VQMSectionTypes.DETAILS , data: detailsData },
      { type: VQMSectionTypes.SECTIONS, data: sectionData },
      { type: VQMSectionTypes.SESSION , data: sessionData },
    ]);
  };

  _handleKeyExtractor = (item, index) => {
    const type = item.type;

    switch (type) {
      case VQMSectionTypes.DETAILS : return (`${type}-${index}`);
      case VQMSectionTypes.SECTIONS: return (item[QuizSectionKeys.sectionID]);
      case VQMSectionTypes.SESSION : return (index); //todo: impl.
    };
  };

  _handleOnPressDelete = async () => {
    const { componentId, ...props } = this.props;

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
      Navigation.dismissModal(componentId);
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
    const { navigation, componentId, ...props } = this.props;

    const quiz = props[MNPViewQuiz.quiz];
    const onPressStartQuiz = props[MNPViewQuiz.onPressStartQuiz];

    // call callback
    onPressStartQuiz && onPressStartQuiz({quiz});
    
    navigation.navigate(ROUTES.quizSessionRoute, {
      [SNPQuizSession.quiz]: quiz,
    });

    await Promise.all([
      Helpers.timeout(1000),
      this.overlayRef.show(),
    ]);

    //close modal
    Navigation.dismissModal(componentId);
  };

  // ModalFooter: onPress "cancel" button
  _handleOnPressButtonRight = () => {
    const { componentId } = this.props;

    //close modal
    Navigation.dismissModal(componentId);
  };

  // #region - render methods
  _renderSectionHeader = ({section}) => {
    switch (section.type) {
      case VQMSectionTypes.DETAILS: return (
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
      case VQMSectionTypes.SESSION: return (
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
    if(data.trailingItem) return null;

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
          {...{index}}
        />
      );
      case VQMSectionTypes.SESSION: return (
        <ViewQuizSessionItem
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
            color={'white'}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
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
      <ModalBackground
        wrapInScrollView={false}
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
      </ModalBackground>
    );
  };
  // #endregion
};