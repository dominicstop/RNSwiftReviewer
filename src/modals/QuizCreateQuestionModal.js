import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

import LottieView        from 'lottie-react-native';
import Ionicon           from '@expo/vector-icons/Ionicons';
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons';

import { Navigation } from 'react-native-navigation';

import { ModalBackground     } from 'app/src/components/ModalBackground';
import { ModalHeader         } from 'app/src/components/ModalHeader';
import { ModalFooter         } from 'app/src/components/ModalFooter';
import { ModalFooterButton   } from 'app/src/components/ModalFooterButton';
import { ModalSection        } from 'app/src/components/ModalSection';
import { ModalInputField     } from 'app/src/components/ModalInputField';
import { ListFooterIcon      } from 'app/src/components/ListFooterIcon';
import { ImageTitleSubtitle  } from 'app/src/components/ImageTitleSubtitle';
import { ButtonGradient      } from 'app/src/components/ButtonGradient';
import { ModalInputMultiline } from 'app/src/components/ModalInputMultiline';
import { ModalSectionHeader  } from 'app/src/components/ModalSectionHeader';



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
    },
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
        stickyHeaderIndices={[0, 2]}
        {...{modalHeader, modalFooter}}
      >
        <ModalSectionHeader
          title={'Question'}
          showTopBorder={false}
          titleIcon={(
            <MaterialCommunity
              name={'format-letter-case'}
              size={24}
              color={Colors.INDIGO.A400}
            />
          )}
        />
        <ModalSection showBorderTop={false}>
          <ModalInputMultiline
            index={0}
            ref={r => this.inputFieldRefQuestion = r}
            inputRef={r => this.inputRefTitle = r}
            subtitle={'Enter the question you want to ask'}
            placeholder={'Input Question Text'}
            //initialValue={props[MNPCreateQuiz.quizTitle]}
            onSubmitEditing={this._handleOnSubmitEditing}
            validate={Validate.isNotNullOrWhitespace}
          />
        </ModalSection>
        <ModalSectionHeader
          title={'Answer'}
          titleIcon={(
            <Ionicon
              name={'ios-list'}
              size={24}
              color={Colors.INDIGO.A400}
            />
          )}
        />
        <ModalSection showBorderTop={false}>
          <ModalInputMultiline
            index={1}
            ref={r => this.inputFieldRefQuestion = r}
            inputRef={r => this.inputRefTitle = r}
            subtitle={"Enter the question's answer"}
            placeholder={'Input Answer Text'}
            //initialValue={props[MNPCreateQuiz.quizTitle]}
            onSubmitEditing={this._handleOnSubmitEditing}
            validate={Validate.isNotNullOrWhitespace}
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