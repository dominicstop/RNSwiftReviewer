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
import { MNPQuizCreateQuestion } from 'app/src/constants/NavParams';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';
import { QuizSectionKeys } from '../constants/PropKeys';
import { QuizSectionModel, SectionTypeTitles, SectionTypes } from '../models/QuizSectionModel';
import { Divider } from 'react-native-elements';


const SectionTypeDescs = {
  [SectionTypes.TRUE_OR_FALSE  ]: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.'  ,
  [SectionTypes.MATCHING_TYPE  ]: 'Fusce dapibus, tellus ac cursus commodo, tortorjusto sit amet risus.'  ,
  [SectionTypes.IDENTIFICATION ]: 'Morbi leo risus, porta ac consectetur ac, vestibulum at eros.' ,
  [SectionTypes.MULTIPLE_CHOICE]: 'Cum sociis natoque penatibus et magnis dis parturient montes',
};

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
  };

  // ModalFooter: save button
  _handleOnPressButtonLeft = () => {
    const { componentId, ...props } = this.props;

    const onPressDone = props[MNPQuizCreateQuestion.onPressDone];

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

  render(){
    const { styles } = QuizCreateQuestionModal;
    const props = this.props;

    const section = props[MNPQuizCreateQuestion.quizSection];

    const sectionTitle = section[QuizSectionKeys.sectionTitle];
    const sectionType  = section[QuizSectionKeys.sectionType];

    const displaySectionType = SectionTypeTitles[sectionType];
    const displaySectionDesc = SectionTypeDescs [sectionType];

    const modalHeader = (
      <ModalHeader
        title={'New Question'}
        subtitle={`Create a new question for ${sectionTitle}`}
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
        stickyHeaderIndices={[1, 3]}
        animateAsGroup={true}
        {...{modalHeader, modalFooter}}
      >
        <ModalSection containerStyle={{ padding: 0 }}>
          <ImageTitleSubtitle
            title={`New ${displaySectionType} item`}
            subtitle={displaySectionDesc}
            imageSource={require('app/assets/icons/e-book-computer.png')}
            hasPadding={false}
          />
        </ModalSection>
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