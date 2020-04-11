import React from 'react';
import { Platform, StyleSheet, Text, View, SectionList } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalSectionHeader } from 'app/src/components/ModalSectionHeader';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';

import { ViewQuizDetails     } from 'app/src/components/ViewQuizModal/ViewQuizDetails';
import { ViewQuizSectionList } from 'app/src/components/ViewQuizModal/ViewQuizSectionList';
import { ViewQuizSessionList } from 'app/src/components/ViewQuizModal/ViewQuizSessionList';

import { ROUTES } from 'app/src/constants/Routes';
import { MNPViewQuiz } from '../constants/NavParams';
import { QuizKeys, QuizSectionKeys } from '../constants/PropKeys';


// VQS: ViewQuizModal 🤣
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

    const sessionData = sessions.map(session =>
      ({type: VQMSectionTypes.SESSION, ...session})
    );

    return ([
      { type: VQMSectionTypes.DETAILS , data: detailsData },
      { type: VQMSectionTypes.SECTIONS, data: sectionData },
      { type: VQMSectionTypes.SESSION , data: sessionData },
    ]);
  };

  _handleOnPressCloseModal = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTES.appStackRoute);
  };

  _handleKeyExtractor = (item, index) => {
    const type = item.type;

    switch (type) {
      case VQMSectionTypes.DETAILS : return (`${type}-${index}`);
      case VQMSectionTypes.SECTIONS: return (item[QuizSectionKeys.sectionID]);
      case VQMSectionTypes.SESSION : return (index); //todo: impl.
    };
  };

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
        <ViewQuizSectionList
          {...{index, ...item}}
        />
      );
      case VQMSectionTypes.SESSION: return (
        <ViewQuizSessionList/>
      );
    };
  };

  render(){
    const { styles } = ViewQuizModal;

    const sections = this.getSections();

    const modalHeader = (
      <ModalHeader
        title={'View Quiz'}
        subtitle={'Praesent commodo cursus magna, ve'}
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

    return (
      <ModalBackground
        wrapInScrollView={false}
        {...{modalHeader, modalFooter}}
      >
        <SectionList
          ref={r => this.sectionList = r}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          SectionSeparatorComponent={this._renderSectionSeperator}
          //ListHeaderComponent={this._renderListHeader}
          //ListFooterComponent={this._renderListFooter}
          {...{sections}}
        />
      </ModalBackground>
    );
  };
};