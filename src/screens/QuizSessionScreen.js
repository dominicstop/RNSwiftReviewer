import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';

import { StackActions } from 'react-navigation';

import { FlatListCarousel  } from 'app/src/components/QuizSessionScreen/FlatListCarousel';
import { QuizQuestionItem  } from 'app/src/components/QuizSessionScreen/QuizQuestionItem';
import { QuizSessionHeader } from 'app/src/components/QuizSessionScreen/QuizSessionHeader';

import * as Helpers from 'app/src/functions/helpers';

import { QuizSessionModel } from 'app/src/models/QuizSession';

import { SNPQuizSession, MNPQuizSessionDoneModal } from 'app/src/constants/NavParams';
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

    this.keyboardVisible = false;

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
  
  // #region - event handlers / callbacks
  _keyboardWillShow = (event) => {
    const { currentIndex, questions } = this.state;
    this.keyboardVisible = true;

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
    this.keyboardVisible = false;

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

  // FlatListCarousel - flatlist
  _handleKeyExtractor = (item, index) => (
    item[QuizQuestionKeys.questionID]
  );

  // QuizSessionHeader: onPress Done
  _handleOnPressDone = async () => {
    const { questions, currentIndex } = this.state;
    const currentQuestion = questions[currentIndex];

    const quiz    = { ...this.quiz };
    const answers = this.answers.answerMap;
    const session = this.session.values;

    const sectionType = currentQuestion[QuizQuestionKeys.sectionType];
    if(sectionType == SectionTypes.IDENTIFICATION && this.keyboardVisible){
      Keyboard.dismiss();
      await Helpers.timeout(750);
    };

    // open QuizSessionDoneModal
    ModalController.showModal({
      routeName: RNN_ROUTES.ModalQuizSessionDone,
      navProps: {
        [MNPQuizSessionDoneModal.quiz           ]: quiz           ,
        [MNPQuizSessionDoneModal.answers        ]: answers        ,
        [MNPQuizSessionDoneModal.session        ]: session        ,
        [MNPQuizSessionDoneModal.questions      ]: questions      ,
        [MNPQuizSessionDoneModal.currentIndex   ]: currentIndex   ,
        [MNPQuizSessionDoneModal.currentQuestion]: currentQuestion,
        [MNPQuizSessionDoneModal.onPressQuestion]: this._handleModalOnPressQuestion,
        [MNPQuizSessionDoneModal.onPressDone    ]: this._handleModalOnPressDone,
      },
    });
  };

  // QuizSessionHeader: onPress Cancel
  _handleOnPressCancel = async () => {
    const { navigation } = this.props;

    const confirm = await Helpers.asyncActionSheetConfirm({
      title: 'Discard Quiz Session',
      message: "Are you sure you want to discard the current quiz session and go back? None of your progress will be saved.",
      confirmText: 'Quit Session',
      isDestructive: true,
    });

    if(confirm){
      // pop back to home route
      navigation && navigation.dispatch(
        StackActions.popToTop()
      );
    };
  };
  
  // FlatListCarousel
  _handleSnap = ({index}) => {
    const { currentIndex } = this.state;

    if(currentIndex != index){
      this.setState({
        currentIndex: index,
      });
    };
  };

  // FlatListCarousel
  _handleOnBeforeSnap = ({nextIndex}) => {
    const { currentIndex } = this.state;

    if(currentIndex != nextIndex){
      this.setState({
        currentIndex: nextIndex,
      });
    };
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
      routeName: RNN_ROUTES.ModalQuizSessionChooseAnswer,
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

  _handleModalOnPressQuestion = async ({index}) => {
    const { currentIndex } = this.state;

    if(index != currentIndex){
      this.flatlistCarouselRef.scrollToIndex(index, false);
      this.setState({ currentIndex: index });
    };
  };

  _handleModalOnPressDone = () => {
    alert('_handleModalOnPressDone');
  };
  //#endregion

  // #region - render functions
  // FlatListCarousel - flatlist
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
          ref={r => this.flatlistCarouselRef = r}
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
  //#endregion
};