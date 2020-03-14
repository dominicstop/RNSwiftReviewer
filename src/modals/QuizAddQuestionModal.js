import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Keyboard, Animated } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { Navigation } from 'react-native-navigation';

import { ModalBackground   } from 'app/src/components/ModalBackground';
import { ModalHeader       } from 'app/src/components/ModalHeader';
import { ModalFooter       } from 'app/src/components/ModalFooter';
import { ModalFooterButton } from 'app/src/components/ModalFooterButton';
import { ModalSection      } from 'app/src/components/ModalSection';
import { ListFooterIcon    } from 'app/src/components/ListFooterIcon';

import { RNN_ROUTES } from 'app/src/constants/Routes';
import { } from 'app/src/constants/NavParams';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';


export class QuizAddQuestionModal extends React.Component {
  static options() {
    return {
    };
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    headerContainer: {
      paddingVertical: 10,
    },
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.5)'
    },
    overlay: {
    },
  });

  constructor(props){
    super(props);

    this.progress = new Animated.Value(0);

    this._opacity = this.progress.interpolate({
      inputRange : [0, 0.25],
      outputRange: [0, 1  ],
    });

    this.lottieSource = require('app/assets/lottie/check_done.json');
  };

  _handleOnSubmitEditing = ({index}) => {
    if(index == 0){
      this.inputRefDesc.focus();

    } else if(index == 1){
      Keyboard.dismiss();
    };
  };

  _handleOnPressButtonLeft = async () => {

  };

  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    // close modal
    await Helpers.timeout(200);
    Navigation.dismissModal(componentId);
  };

  render(){
    const { styles } = QuizAddQuestionModal;
    const props = this.props;

    const modalHeader = (
      <ModalHeader
        title={'WIP'}
        subtitle={'WIP'}
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
          buttonLeftTitle={'WIP'}
          buttonLeftSubtitle={'WIP'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    return (
      <ModalBackground
        {...{modalHeader, modalFooter}}
      >
        <ModalSection showBorderTop={false}>

        </ModalSection>
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};
