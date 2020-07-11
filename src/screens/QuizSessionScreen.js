import React, { Fragment } from 'react';
import { StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { StackActions } from 'react-navigation';

import { FlatListCarousel  } from 'app/src/components/QuizSessionScreen/FlatListCarousel';
import { QuizQuestionItem  } from 'app/src/components/QuizSessionScreen/QuizQuestionItem';
import { QuizSessionHeader } from 'app/src/components/QuizSessionScreen/QuizSessionHeader';

import { BannerPill           } from 'app/src/components/BannerPill';
import { ScreenOverlayLoading } from 'app/src/components/ScreenOverlayLoading';

import { ModalView } from 'app/src/components_native/ModalView';

import { QuizSessionDoneModal         } from 'app/src/modals/QuizSessionDoneModal';
import { QuizSessionQuestionsModal    } from 'app/src/modals/QuizSessionQuestionsModal';
import { QuizSessionChooseAnswerModal } from 'app/src/modals/QuizSessionChooseAnswerModal';

import { QuizQuestionKeys, QuizSessionKeys } from 'app/src/constants/PropKeys';
import { SNPQuizSession, SNPQuizSessionResult, MNPQuizSessionDoneModal, MNPQuizSessionQuestion } from 'app/src/constants/NavParams';

import { SectionTypes } from 'app/src/constants/SectionTypes';
import { RNN_ROUTES, ROUTES, ModalID } from 'app/src/constants/Routes';
import { MNPQuizSessionChooseAnswer } from 'app/src/constants/NavParams';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizStore        } from 'app/src/functions/QuizStore';
import { QuizSessionStore } from 'app/src/functions/QuizSessionStore';

import { QuizSessionModel         } from 'app/src/models/QuizSession';
import { QuizSessionAnswerModel   } from 'app/src/models/QuizSessionAnswerModel';
import { QuizSessionBookmarkModel } from 'app/src/models/QuizSessionBookmarkModel';


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

    const bookmarks = new QuizSessionBookmarkModel();
    this.bookmarks = bookmarks;

    this.keyboardVisible = false;

    this.state = {
      updateIndex : 0,
      currentIndex: 0,
      answers  : answers  .answerMap  ,
      questions: session  .questions  ,
      bookmarks: bookmarks.bookmarkMap,
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

  updateBookmarks = (bookmarks) => {
    this.bookmarks.setBookmarks(bookmarks);
    this.setState((prevState) => ({
      ...prevState,
      bookmarks  : this.bookmarks.bookmarkMap ,
      updateIndex: (prevState.updateIndex + 1),
    }));
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

    const quiz      = { ...this.quiz };
    const answers   = this.answers.answerMap;
    const session   = this.session.values;
    const bookmarks = this.bookmarks.bookmarkMap;

    const sectionType = currentQuestion[QuizQuestionKeys.sectionType];
    if(sectionType == SectionTypes.IDENTIFICATION && this.keyboardVisible){
      Keyboard.dismiss();
      await Helpers.timeout(750);
    };

    // open QuizSessionDoneModal
    this.modalViewDoneRef.setVisibility(true, {
      [MNPQuizSessionDoneModal.quiz           ]: quiz           ,
      [MNPQuizSessionDoneModal.answers        ]: answers        ,
      [MNPQuizSessionDoneModal.session        ]: session        ,
      [MNPQuizSessionDoneModal.bookmarks      ]: bookmarks      ,
      [MNPQuizSessionDoneModal.questions      ]: questions      ,
      [MNPQuizSessionDoneModal.currentIndex   ]: currentIndex   ,
      [MNPQuizSessionDoneModal.currentQuestion]: currentQuestion,
      [MNPQuizSessionDoneModal.onPressDone    ]: this._handleModalOnPressDone,
      [MNPQuizSessionDoneModal.updateBookmarks]: this.updateBookmarks,
      [MNPQuizSessionDoneModal.onPressQuestion]: this._handleModalOnPressQuestion1,
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
  
  // QuizSessionHeader: onPress Center Pill
  _handleOnPressPill = async () => {
    const { questions, currentIndex } = this.state;
    const currentQuestion = questions[currentIndex];

    const quiz      = { ...this.quiz };
    const answers   = this.answers.answerMap;
    const session   = this.session.values;
    const bookmarks = this.bookmarks.bookmarkMap;
    
    const sectionType = currentQuestion[QuizQuestionKeys.sectionType];
    if(sectionType == SectionTypes.IDENTIFICATION && this.keyboardVisible){
      Keyboard.dismiss();
      await Helpers.timeout(750);
    };

    // open QuizSessionQuestionsModal
    this.modalViewQuestionsRef.setVisibility(true, {
      [MNPQuizSessionQuestion.quiz           ]: quiz           ,
      [MNPQuizSessionQuestion.answers        ]: answers        ,
      [MNPQuizSessionQuestion.session        ]: session        ,
      [MNPQuizSessionQuestion.questions      ]: questions      ,
      [MNPQuizSessionQuestion.bookmarks      ]: bookmarks      ,
      [MNPQuizSessionQuestion.currentIndex   ]: currentIndex   ,
      [MNPQuizSessionQuestion.currentQuestion]: currentQuestion,
      [MNPQuizSessionQuestion.updateBookmarks]: this.updateBookmarks,
      [MNPQuizSessionQuestion.onPressQuestion]: this._handleModalOnPressQuestion2,
    });
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
    this.modalViewChooseAnswerRef.setVisibility(true, {
      [MNPQuizSessionChooseAnswer.quiz          ]: this.quiz,
      [MNPQuizSessionChooseAnswer.question      ]: question,
      [MNPQuizSessionChooseAnswer.answer        ]: answer,
      [MNPQuizSessionChooseAnswer.answers       ]: answers,
      [MNPQuizSessionChooseAnswer.sectionChoices]: sectionChoices,
      [MNPQuizSessionChooseAnswer.onPressDone   ]: this._handleOnAnswerSelected,
    });
  };

  // QuizQuestionItem
  _handleOnLongPress = async ({index, question}) => {
    const questionID = question[QuizQuestionKeys.questionID];
    const bookmark   = this.bookmarks.bookmarkMap[questionID];

    const isBookmarked = (
      (bookmark != null     ) ||
      (bookmark != undefined)
    );

    const confirm = await Helpers.asyncActionSheetConfirm(isBookmarked?{
      title: '',
      message: "Are you sure that you want to remove the bookmark for this question.",
      confirmText: 'Remove Bookmark',
      isDestructive: true,
    }:{
      title: '',
      message: "Are you sure that you want to bookmark this question?",
      confirmText: 'Add Bookmark',
      isDestructive: false,
    });

    if(confirm && !isBookmarked){
      this.rootContainerRef.pulse(500);
      this.bookmarks.addBookmark(questionID);
      this.bannerPillRef.show({
        message: 'Bookmark Added',
        iconKey: iconMapKeys.bookmark,
        bgColor: Colors.ORANGE.A700,
      });

      this.setState((prevState) => ({
        ...prevState,
        answers: this.answers.answerMap,
        updateIndex: (prevState.updateIndex + 1),
      }));

    } else if(confirm && isBookmarked) {
      this.rootContainerRef.pulse(500);
      this.bookmarks.removeBookmark(questionID);
      this.bannerPillRef.show({
        message: 'Bookmark Removed',
        iconKey: iconMapKeys.removed,
      });

      this.setState((prevState) => ({
        ...prevState,
        answers: this.answers.answerMap,
        updateIndex: (prevState.updateIndex + 1),
      }));
    };
  };

  // QuizQuestionItem - AnswerMatchingType
  _handleOnAnswerSelected = ({question, answer}) => {
    const prevState = this.state;

    this.answers.addAnswer(question, answer);
    this.setState({
      ...prevState,
      answers: this.answers.answerMap,
    });
  };

  // QuizSessionDoneModal
  _handleModalOnPressQuestion1 = async ({index}) => {
    const { currentIndex } = this.state;

    if(index != currentIndex){
      this.flatlistCarouselRef.scrollToIndex(index, false);
      this.setState({ currentIndex: index });
    };
  };

  // QuizSessionQuestionModal
  _handleModalOnPressQuestion2 = async ({index}) => {
    const { currentIndex } = this.state;

    const showLoading = (
      (Math.abs(currentIndex - index) > 10)
    );

    if(index != currentIndex){
      this.flatlistCarouselRef.scrollToIndex(index, true);
      this.setState({ currentIndex: index });

      if(showLoading){
        await this.overlayRef.setVisibility(true);
        await Helpers.timeout(300);

        this.overlayRef.setVisibility(false);
        this.rootContainerRef.pulse(500);

      } else {
        await Helpers.timeout(700);
        this.rootContainerRef.pulse(500);
      };
    };
  };

  // QuizSessionDoneModal
  _handleModalOnPressDone = async () => {
    const { navigation } = this.props;

    // save bookmarks/answers in session
    this.session.answers   = this.answers  .answerMap;
    this.session.bookmarks = this.bookmarks.bookmarkMap;

    this.session.initResults();
    this.session.setEndDate();

    const session = this.session.values;
    await QuizSessionStore.insertSession(session);

    const quizes   = QuizStore.getCache();
    const sessions = QuizSessionStore.getCache();

    navigation.dispatch(
      StackActions.replace({
        routeName: ROUTES.quizSessionResultRoute,
        params: {
          [SNPQuizSessionResult.quiz    ]: this.quiz,
          [SNPQuizSessionResult.quizes  ]: quizes   ,
          [SNPQuizSessionResult.session ]: session  ,
          [SNPQuizSessionResult.sessions]: sessions ,
        },
      })
    );
  };
  //#endregion

  // #region - render functions
  _renderModals(){
    return(
      <Fragment>
        <ModalView
          ref={r => this.modalViewDoneRef = r}
          setModalInPresentationFromProps={true}
          modalID={ModalID.ModalQuizSessionDone}
        >
          <QuizSessionDoneModal/>
        </ModalView>
        <ModalView
          ref={r => this.modalViewQuestionsRef = r}
          setModalInPresentationFromProps={true}
          modalID={ModalID.ModalQuizSessionQuestions}
        >
          <QuizSessionQuestionsModal/>
        </ModalView>
        <ModalView
          ref={r => this.modalViewChooseAnswerRef = r}
          setModalInPresentationFromProps={true}
          modalID={ModalID.ModalQuizSessionChooseAnswer}
        >
          <QuizSessionChooseAnswerModal/>
        </ModalView>
      </Fragment>
    );
  };

  // FlatListCarousel - flatlist
  _renderItem = ({item, index}) => {
    const { currentIndex, answers, bookmarks } = this.state;
    const questionID = item[QuizQuestionKeys.questionID];

    // undefined when no matching answer/bookmark
    const answer   = answers  [questionID];
    const bookmark = bookmarks[questionID];

    return(
      <QuizQuestionItem
        ref={r => this[`item-${index}`] = r}
        question={item}
        isFocused={(currentIndex == index)}
        onLongPress={this._handleOnLongPress}
        onAnswerSelected={this._handleOnAnswerSelected}
        onPressChooseAnswer={this._handleOnPressChooseAnswer}
        {...{index, answer, bookmark, currentIndex}}
      />
    );
  };

  render(){
    const { styles } = QuizSessionScreen;
    const { currentIndex, updateIndex, questions: data } = this.state;
    const extraData = { currentIndex, updateIndex };

    return(
      <Fragment>
        {this._renderModals()}
        <Animatable.View 
          ref={r => this.rootContainerRef = r}
          style={styles.rootContainer}
          useNativeDriver={true}
        >
          <FlatListCarousel
            ref={r => this.flatlistCarouselRef = r}
            keyExtractor={this._handleKeyExtractor}
            renderItem={this._renderItem}
            onSnap={this._handleSnap}
            onBeforeSnap={this._handleOnBeforeSnap}
            {...{data, extraData}}
          />
        </Animatable.View>
        <QuizSessionHeader
          totalCount={data.length}
          currentIndex={(currentIndex + 1)}
          onPressPill={this._handleOnPressPill}
          onPressDone={this._handleOnPressDone}
          onPressCancel={this._handleOnPressCancel}
          banner={(
            <BannerPill
              ref={r => this.bannerPillRef = r}
              iconMap={iconMap}
            />
          )}
        />
        <ScreenOverlayLoading
          ref={r => this.overlayRef = r}
          excludeHeader={true}
        />
      </Fragment>
    );
  };
  //#endregion
};


const iconMapKeys = {
  removed : 'removed' ,
  bookmark: 'bookmark',
};

const iconMap = {
  [iconMapKeys.bookmark]: (
    <Ionicon
      style={{marginTop: 3}}
      name={'ios-bookmark'}
      size={18}
      color={'white'}
    />
  ),
  [iconMapKeys.removed]: (
    <Ionicon
      name={'ios-remove-circle'}
      size={18}
      color={'white'}
    />
  ),
};