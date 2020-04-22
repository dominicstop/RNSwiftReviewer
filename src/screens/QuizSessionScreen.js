import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Keyboard } from 'react-native';

import { FlatListCarousel  } from 'app/src/components/QuizSessionScreen/FlatListCarousel';
import { QuizQuestionItem  } from 'app/src/components/QuizSessionScreen/QuizQuestionItem';
import { QuizSessionHeader } from 'app/src/components/QuizSessionScreen/QuizSessionHeader';

import * as Helpers from 'app/src/functions/helpers';

import { QuizSessionModel } from 'app/src/models/QuizSession';

import { SNPQuizSession   } from 'app/src/constants/NavParams';
import { QuizQuestionKeys } from 'app/src/constants/PropKeys';

import { SectionTypes } from '../constants/SectionTypes';
import { RNN_ROUTES } from '../constants/Routes';
import { ModalController } from '../functions/ModalController';


export class QuizSessionScreen extends React.Component {
  static navigationOptions = {
    title: 'N/A',
    headerShown: false,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    flatList: {
      flex: 1,
    },
  });

  constructor(props){
    super(props);
    // get nav params passed from prev screen
    const { params } = props.navigation.state;

    const quiz = params[SNPQuizSession.quiz];

    const session = new QuizSessionModel();
    session.initFromQuiz(quiz);

    this.session = session;

    this.state = {
      currentIndex: 0,
      questions: session.questions,
    };
  };

  componentDidMount(){
    // subscribe to event listeners
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  };

  componentWillUnmount() {
    // ubsubsrcibe to event listeners
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  _keyboardWillShow = (event) => {
    const { currentIndex, questions } = this.state;

    // get current question
    const question = questions[currentIndex];
    // get ref to current question item
    const questionRef = this[`item-${currentIndex}`];

    const type = question[QuizQuestionKeys.sectionType];
    if(type == SectionTypes.IDENTIFICATION){
      // manually trigger keyboard event handler
      questionRef?._onKeyboardWillShowHide(event, true);
    };
  };

  _keyboardWillHide = (event) => {
    const { currentIndex, questions } = this.state;

    // get current question
    const question = questions[currentIndex];
    // get ref to current question item
    const questionRef = this[`item-${currentIndex}`];

    const type = question[QuizQuestionKeys.sectionType];
    if(type == SectionTypes.IDENTIFICATION){
      // manually trigger keyboard event handler
      questionRef?._onKeyboardWillShowHide(event, false);
    };
  };

  _handleKeyExtractor = (item, index) => (
    item[QuizQuestionKeys.questionID]
  );

  // QuizSessionHeader: onPress Done
  _handleOnPressDone = () => {
    alert('done');
  };

  // QuizSessionHeader: onPress Cancel
  _handleOnPressCancel = () => {
    alert('cancel');
  };
  
  // FlatListCarousel
  _handleSnap = ({index}) => {
    this.setState({
      currentIndex: index
    });
  };

  // FlatListCarousel
  _handleOnBeforeSnap = ({nextIndex}) => {
    this.setState({
      currentIndex: nextIndex,
    });
  };

  // QuizQuestionItem - AnswerMatchingType
  _handleOnPressAnswer = () => {
    const { } = this.props;

    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizSessionChooseAnswer,
      navProps: {
      },
    });
  };

  _renderItem = ({item, index}) => {
    const { currentIndex } = this.state;

    return(
      <QuizQuestionItem
        ref={r => this[`item-${index}`] = r}
        isFocused={(currentIndex == index)}
        onPressChooseAnswer={this._handleOnPressAnswer}
        {...{index, currentIndex, ...item}}
      />
    );
  };

  render(){
    const { styles } = QuizSessionScreen;
    const { currentIndex, questions: data } = this.state;

    const extraData = {
      currentIndex
    };

    return(
      <View style={styles.rootContainer}>
        <FlatListCarousel
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          onSnap={this._handleSnap}
          onBeforeSnap={this._handleOnBeforeSnap}
          {...{data, extraData}}
        />
        <QuizSessionHeader
          totalCount={data.length}
          currentIndex={(currentIndex + 1)}
          onPressDone={this._handleOnPressDone}
          onPressCancel={this._handleOnPressCancel}
        />
      </View>
    );
  };
};