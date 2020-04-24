import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';

import { FlatListCarousel  } from 'app/src/components/QuizSessionScreen/FlatListCarousel';
import { QuizQuestionItem  } from 'app/src/components/QuizSessionScreen/QuizQuestionItem';
import { QuizSessionHeader } from 'app/src/components/QuizSessionScreen/QuizSessionHeader';

import * as Helpers from 'app/src/functions/helpers';

import { QuizSessionModel } from 'app/src/models/QuizSession';

import { SNPQuizSession   } from 'app/src/constants/NavParams';
import { QuizQuestionKeys, QuizSessionKeys } from 'app/src/constants/PropKeys';

import { SectionTypes    } from 'app/src/constants/SectionTypes';
import { RNN_ROUTES      } from 'app/src/constants/Routes';
import { ModalController } from 'app/src/functions/ModalController';
import { MNPQuizSessionChooseAnswer } from 'app/src/constants/NavParams';

import { QuizSessionAnswerModel } from 'app/src/models/QuizSessionAnswerModel';



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
    this.quiz = quiz;

    const session = new QuizSessionModel();
    session.initFromQuiz(quiz);
    this.session = session;

    const answers = new QuizSessionAnswerModel();
    answers.initFromSession(session.values);
    this.answers = answers;

    this.state = {
      currentIndex: 0,
      questions: session.questions,
      answers: answers.answerMap,
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
  _handleOnPressChooseAnswer = (question, answer) => {
    const answers = this.answers.answerMap;

    // get matchingTypeChoices obj - holds all the choices for each section
    const matchingTypeChoices = this.session.values[
      QuizSessionKeys.matchingTypeChoices
    ];

    // get the sectionID of the question
    const sectionID = question[QuizQuestionKeys.sectionID];

    // get the matchingTypeChoices for this section
    const sectionChoices = matchingTypeChoices[sectionID];

    
    // open QuizSessionChooseAnswerModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizSessionChooseAnswer,
      navProps: {
        [MNPQuizSessionChooseAnswer.quiz          ]: this.quiz,
        [MNPQuizSessionChooseAnswer.question      ]: question,
        [MNPQuizSessionChooseAnswer.answer        ]: answer,
        [MNPQuizSessionChooseAnswer.answers       ]: answers,
        [MNPQuizSessionChooseAnswer.sectionChoices]: sectionChoices,
        [MNPQuizSessionChooseAnswer.onPressDone   ]: this._handleOnAnswerSelected,
      },
    });
  };

  _handleOnAnswerSelected = ({question, answer}) => {
    const prevState = this.state;

    this.answers.addAnswer(question, answer);
    this.setState({
      ...prevState,
      answers: this.answers.answerMap,
    });
  };

  _renderItem = ({item, index}) => {
    const { currentIndex, answers } = this.state;

    const questionID = item[QuizQuestionKeys.questionID];
    // undefined when no matching answer
    const answer = answers[questionID];

    return(
      <QuizQuestionItem
        ref={r => this[`item-${index}`] = r}
        isFocused={(currentIndex == index)}
        question={item}
        onAnswerSelected={this._handleOnAnswerSelected}
        onPressChooseAnswer={this._handleOnPressChooseAnswer}
        {...{index, answer, currentIndex}}
      />
    );
  };

  render(){
    const { styles } = QuizSessionScreen;
    const { currentIndex, questions: data, answers } = this.state;

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