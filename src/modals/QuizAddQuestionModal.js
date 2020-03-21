import React from 'react';
import { StyleSheet, SectionList, Text, View, ScrollView, Keyboard, TouchableOpacity } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalSectionHeader } from 'app/src/components/ModalSectionHeader';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';
import { ModalSection       } from 'app/src/components/ModalSection';
import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';
import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';
import { ButtonGradient     } from 'app/src/components/ButtonGradient';

import { ModalQuizAddQuestionItem } from 'app/src/components/ModalQuizAddQuestionItem';

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
import { iOSUIKit } from 'react-native-typography';


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

  // Add New Question button press
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

  // QuizCreateQuestionModal: onPressDone
  _handleOnPressDoneQuizCreateQuestionModal = ({question}) => {
    this.quizSection.addQuestion(question);
    
    this.setState({
      ...this.quizSection.values,
    });
  };

  _handleKeyExtractor = (section, index) => {
    return index;
  };

  _renderListHeader = () => {
    const { styles } = QuizAddQuestionModal;
    const state = this.state;

    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];
    const count     = questions.length;

    const sectionTitle = state[QuizSectionKeys.sectionTitle];

    if(count > 0) return null;

    return(
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
          title={'Add New Question'}
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
    );
  };

  _renderListFooter = () => {
    const state = this.state;

    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];
    const count     = questions.length;

    if(count <= 0) return null;

    return(
      <ModalSection>
        <TouchableOpacity 
          style={{alignItems: 'center'}}
          onPress={this._handleOnPressAddNewQuestion}
        >
          <Text style={{...iOSUIKit.bodyEmphasizedObject, color: Colors.BLUE.A700}}>
            {'Insert Question'}
          </Text>
        </TouchableOpacity>
      </ModalSection>
    );
  };

  _renderSectionHeader = ({section}) => {
    const state = this.state;

    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];
    const count     = questions.length

    if(count == 0) return null;

    return(
      <ModalSectionHeader
        title={'Questions'}
        subtitle={`Currently showing ${count} ${Helpers.plural('item', count)}`}
        titleIcon={(
          <Ionicon
            name={'ios-bookmarks'}
            size={24}
          />
        )}
      />
    );
  };

  _renderItem = ({item: question, index}) => {
    const state = this.state;
    
    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];
    const isLast    = (index == (questions.length - 1));

    return (
      <ModalQuizAddQuestionItem
        {...{index, isLast, ...question}}
      />
    );
  };

  render(){
    const { styles } = QuizAddQuestionModal;
    const state = this.state;

    const questions = state[QuizSectionKeys.sectionQuestions] ?? [];

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
        wrapInScrollView={false}
        {...{modalHeader, modalFooter}}
      >
        <SectionList
          ref={r => this.sectionList = r}
          sections={[{ data: questions }]}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          ListHeaderComponent={this._renderListHeader}
          ListFooterComponent={this._renderListFooter}
        />
      </ModalBackground>
    );
  };
};
