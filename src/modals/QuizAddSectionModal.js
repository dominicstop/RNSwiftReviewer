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
import { ModalInputField   } from 'app/src/components/ModalInputField';
import { ListFooterIcon    } from 'app/src/components/ListFooterIcon';

import { ROUTES, RNN_ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz } from 'app/src/constants/NavParams';

import { BLUE } from 'app/src/constants/Colors';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';


export class QuizAddSectionModal extends React.Component {
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
    const { navigation, componentId, ...props } = this.props;

    const isEditing   = props[MNPCreateQuiz.isEditing  ];
    const onPressDone = props[MNPCreateQuiz.onPressDone];

    const isValidTitle    = this.inputFieldRefTitle.isValid(false);
    const isValidSubtitle = this.inputFieldRefDesc .isValid(false);

    if(isValidTitle && isValidSubtitle){
      const title = this.inputFieldRefTitle.getText();
      const desc  = this.inputFieldRefDesc .getText()

      !isEditing && navigation.navigate(ROUTES.createQuizRoute, {
        // pass as nav params to CreateQuizScreen
        [SNPCreateQuiz.quizTitle]: title,
        [SNPCreateQuiz.quizDesc ]: desc,
      });

      const animation = Animated.timing(this.progress, {
        toValue : 1,
        duration: 750,
      });

      await new Promise(resolve => {
        animation.start(() => {
          resolve();
        });
      });

      // trigger callback event
      onPressDone && onPressDone({title, desc});

      // close modal
      Navigation.dismissModal(componentId);

    } else {
      await Helpers.asyncAlert({
        title: 'Invalid Input',
        desc : 'Oops, please fill out the required forms to continue.'
      });

      //animate shake
      this.inputFieldRefTitle.isValid(true);
      this.inputFieldRefDesc .isValid(true);
    };
  };

  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    //close modal
    await Helpers.timeout(200);
    Navigation.dismissModal(componentId);
  };

  render(){
    const { styles } = QuizAddSectionModal;
    const props = this.props;

    const isEditing = props[MNPCreateQuiz.isEditing];

    const overlayContainerStyle = {
      opacity: this._opacity,
    };

    const modalHeader = (
      <ModalHeader
        title={(isEditing
          ? 'Edit Section Details'
          : 'Add New Section'
        )}
        subtitle={(isEditing
          ? "Modify section title and description"
          : "Enter the section title and description"
        )}
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
          buttonLeftTitle={(isEditing? 'Save' : 'Done')}
          buttonLeftSubtitle={(isEditing
            ? 'Update section details'
            : 'Create new section'
          )}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    const overlay = (
      <Animated.View 
        style={[styles.overlayContainer, overlayContainerStyle]}
        pointerEvents={'none'}
      >
        <LottieView
          ref={r => this.lottieRef = r}
          progress={this.progress}
          source={this.lottieSource}
        />
      </Animated.View>
    );

    return (
      <ModalBackground
        {...{modalHeader, modalFooter, overlay}}
      >
        <ModalSection showBorderTop={false}>
          <ModalInputField
            index={0}
            ref={r => this.inputFieldRefTitle = r}
            inputRef={r => this.inputRefTitle = r}
            title={'Section Title'}
            subtitle={'Give this section a title (ex: Math Prelims etc.)'}
            placeholder={'Enter Section Title'}
            initialValue={props[MNPCreateQuiz.quizTitle]}
            onSubmitEditing={this._handleOnSubmitEditing}
            validate={Validate.isNotNullOrWhitespace}
            iconActive={(
              <SvgIcon
                name={SVG_KEYS.BookFilled}
                size={20}
              />
            )}
            iconInactive={(
              <SvgIcon
                name={SVG_KEYS.BookOutlined}
                size={20}
              />
            )}
          />
        </ModalSection>
        <ModalSection showBorderTop={false}>
          <ModalInputField
            index={1}
            ref={r => this.inputFieldRefDesc = r}
            inputRef={r => this.inputRefDesc = r}
            title={'Description'}
            subtitle={'Give this section a short description.'}
            placeholder={'Enter Section Title'}
            initialValue={props[MNPCreateQuiz.quizDesc]}
            validate={Validate.isNotNullOrWhitespace}
            iconActive={(
              <SvgIcon
                name={SVG_KEYS.ReceiptsFilled}
                size={20}
              />
            )}
            iconInactive={(
              <SvgIcon
                name={SVG_KEYS.ReceiptsOutlined}
                size={20}
              />
            )}
          />
        </ModalSection>
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};