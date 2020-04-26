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
import { ViewQuizSectionList } from 'app/src/components/ViewQuizModal/ViewQuizSectionList';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { QuizSectionKeys, QuizKeys } from 'app/src/constants/PropKeys';
import { MNPQuizSessionChooseAnswer, MNPQuizSessionDoneModal } from 'app/src/constants/NavParams';

// QSD: QuizSessionDone 🤣
const QSDSectionTypes = {
  DETAILS : 'DETAILS' ,
  SECTIONS: 'SECTIONS',
};


export class QuizSessionDoneModal extends React.Component {

  getSections = () => {
    const props = this.props;

    const quiz     = props[MNPQuizSessionDoneModal.quiz] ?? {};
    const sections = quiz [QuizKeys.quizSections] ?? [];

    const detailsData = [
      { type: QSDSectionTypes.DETAILS }
    ];

    const sectionData = sections.map(section =>
      ({type: QSDSectionTypes.SECTIONS, ...section})
    );

    return ([
      { type: QSDSectionTypes.DETAILS , data: detailsData },
      { type: QSDSectionTypes.SECTIONS, data: sectionData },
    ]);
  };

  _handleKeyExtractor = (item, index) => {
    const type = item.type;

    switch (type) {
      case QSDSectionTypes.DETAILS : return (`${type}-${index}`);
      case QSDSectionTypes.SECTIONS: return (item[QuizSectionKeys.sectionID]);
    };
  };

  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;

    await Helpers.timeout(200);
    //close modal
    Navigation.dismissModal(componentId);
  };

  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    await Helpers.timeout(200);
    //close modal
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
      case QSDSectionTypes.SESSION: return (
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
    const quiz  = props[MNPQuizSessionDoneModal.quiz] ?? {};

    switch (section.type) {
      case QSDSectionTypes.DETAILS: return (
        <ViewQuizDetails
          {...{quiz}}
        />
      );
      case QSDSectionTypes.SECTIONS: return (
        <ViewQuizSectionList
          section={item}
          {...{index}}
        />
      );
    };
  };
  
  render(){
    const props = this.props;
    const sections = this.getSections();

    const modalHeader = (
      <ModalHeader
        title={'Choose Answer'}
        subtitle={"Choose from the following choices..."}
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

    return (
      <ModalBackground
        wrapInScrollView={false}
        animateAsGroup={true}
        {...{modalHeader, modalFooter}}
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
  //#endregion
};