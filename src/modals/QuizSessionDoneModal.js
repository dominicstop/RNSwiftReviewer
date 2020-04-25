import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Ionicon from '@expo/vector-icons/Ionicons';

import { iOSUIKit   } from 'react-native-typography';
import { Navigation } from 'react-native-navigation';

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';
import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';
import { MNPQuizSessionChooseAnswer } from 'app/src/constants/NavParams';


export class QuizSessionDoneModal extends React.Component {

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
  
  render(){
    const props = this.props;

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
          buttonLeftTitle={'Done'}
          buttonLeftSubtitle={'Save answer'}
          buttonRightSubtitle={'Close this modal'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    return (
      <ModalBackground
        wrapInScrollView={true}
        animateAsGroup={true}
        {...{modalHeader, modalFooter}}
      >
        <ListFooterIcon
          show={true}
          hasEntranceAnimation={false}
        />
      </ModalBackground>
    );
  };
};