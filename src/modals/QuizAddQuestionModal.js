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
import { MNPQuizAddQuestion, MNPQuizCreateQuestion } from 'app/src/constants/NavParams';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';
import { QuizSectionKeys } from '../constants/PropKeys';
import { QuizSectionModel } from '../models/QuizSectionModel';
import { Divider } from 'react-native-elements';


export class QuizAddQuestionModal extends React.Component {
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
    const state = this.state;
    
    // extract/isolate section values from stata
    const section = QuizSectionModel.extract(state);

    // open QuizCreateQuestionModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizCreateQuestion,
      navProps: {
        [MNPQuizCreateQuestion.quizSection]: section,
        [MNPQuizCreateQuestion.onPressDone]: this._handleOnPressDoneQuizCreateQuestionModal,
      },
    });
  };

  // QuizCreateQuestionModal
  _handleOnPressDoneQuizCreateQuestionModal = () => {
    console.log('Test Test');
  };

  render(){
    const { styles } = QuizAddQuestionModal;
    const state = this.state;

    const sectionTitle = state[QuizSectionKeys.sectionTitle];

    const modalHeader = (
      <ModalHeader
        title={'Add Questions'}
        subtitle={"Add/Edit this section's questions"}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-bookmarks'}
            size={24}
            color={'white'}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonLeftTitle={'Save'}
          buttonLeftSubtitle={'Confirm changes'}
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
        {true && (
          <ModalSection showBorderTop={false}>
            <ImageTitleSubtitle
              containerStyle={styles.buttonAddSectionEmpty}
              title={'Looks A Bit Empty'}
              subtitle={`${sectionTitle} doesn't have any questions yet. Add some to get started.`}
              imageSource={require('app/assets/icons/lbw-spacecraft-laptop.png')}
            />
            <Divider style={styles.divider}/>
            <ButtonGradient
              containerStyle={styles.buttonAddSectionEmpty}
              bgColor={Colors.BLUE[100]}
              fgColor={Colors.BLUE['A700']}
              alignment={'CENTER'}
              title={'Add New Questions'}
              onPress={this._handleOnPressAddNewQuestion}
              iconDistance={10}
              isBgGradient={false}
              addShadow={false}
              showIcon={true}
              leftIcon={(
                <Ionicon
                  name={'ios-add-circle'}
                  color={Colors.BLUE['A700']}
                  size={25}
                />
              )}
            />
          </ModalSection>
        )}
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};
