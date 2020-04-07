import React from 'react';
import { Platform, StyleSheet, Text, View, SectionList } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalSectionHeader } from 'app/src/components/ModalSectionHeader';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';

import { ModalSection    } from 'app/src/components/ModalSection';

import { ROUTES } from 'app/src/constants/Routes';


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

  _handleOnPressCloseModal = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTES.appStackRoute);
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

  _renderItem = ({item, index, section}) => {
    switch (section.type) {
      case VQMSectionTypes.DETAILS: return (
        <Text>Details</Text>
      );
      case VQMSectionTypes.SECTIONS: return (
        <Text>Sections</Text>
      );
      case VQMSectionTypes.SESSION: return (
        <Text>Sessions</Text>
      );
    };
  };

  render(){
    const { styles } = ViewQuizModal;

    const sections = [
      { type: VQMSectionTypes.DETAILS , data: [{}] },
      { type: VQMSectionTypes.SECTIONS, data: [{}] },
      { type: VQMSectionTypes.SESSION , data: []   },
    ];

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
          //ListHeaderComponent={this._renderListHeader}
          //ListFooterComponent={this._renderListFooter}
          {...{sections}}
        />
      </ModalBackground>
    );
  };
};
