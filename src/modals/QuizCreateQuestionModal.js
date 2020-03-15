import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Keyboard, Animated } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { Navigation } from 'react-native-navigation';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';
import { ModalSection       } from 'app/src/components/ModalSection';
import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';
import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';
import { ButtonGradient     } from 'app/src/components/ButtonGradient';

import { RNN_ROUTES } from 'app/src/constants/Routes';
import { MNPQuizAddQuestion } from 'app/src/constants/NavParams';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';
import { QuizSectionKeys } from '../constants/PropKeys';
import { QuizSectionModel } from '../models/QuizSectionModel';
import { Divider } from 'react-native-elements';


export class QuizCreateQuestionModal extends React.Component {
  static options() {
    return {
    };
  };

  static styles = StyleSheet.create({
    buttonAddSectionEmpty: {
      paddingHorizontal: 0,
      margin: 0,
    },
    divider: {
      margin: 12,
    }
  });

  constructor(props){
    super(props);

    // get section from nav props
    const section = props[MNPQuizAddQuestion.quizSection];
    this.quizSection = new QuizSectionModel(section);

    this.state = {
      ...this.quizSection.values,
    };
  };

  // ModalFooter: save button
  _handleOnPressButtonLeft = () => {
    const { componentId, ...props } = this.props;

    const onPressDone = props[MNPQuizAddQuestion.onPressDone];

    // trigger callback event
    onPressDone && onPressDone({
    });

    // close modal
    Navigation.dismissModal(componentId);
  };

  // ModalFooter: cancel button
  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    // close modal
    await Helpers.timeout(200);
    Navigation.dismissModal(componentId);
  };

  _handleOnPressAddNewQuestion = () => {
    alert();
  };

  render(){
    const { styles } = QuizCreateQuestionModal;
    const state = this.props;

    const sectionTitle = state[QuizSectionKeys.sectionTitle];

    const modalHeader = (
      <ModalHeader
        title={'New Question'}
        subtitle={"Create and add a new question"}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-add-circle'}
            size={24}
            color={'white'}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonLeftTitle={'Create Quiz'}
          buttonLeftSubtitle={'Save this Quiz'}
          buttonRightSubtitle={'Discard Changes'}
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