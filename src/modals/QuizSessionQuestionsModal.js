import React, { Fragment } from 'react';
import { Alert, FlatList } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { ModalBody    } from 'app/src/components/Modal/ModalBody';
import { ModalHeader  } from 'app/src/components/Modal/ModalHeader';
import { ModalSection } from 'app/src/components/Modal/ModalSection';

import { ViewQuizOverlay } from 'app/src/components/ViewQuizModal/ViewQuizOverlay';

import { BannerPill         } from 'app/src/components/BannerPill';
import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';
import { QuizSessionDetails } from 'app/src/components/QuizSessionDoneModal/QuizSessionDetails';
import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';
import { QuestionAnswerItem } from 'app/src/components/QuizSessionDoneModal/QuestionAnswerItem';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionKeys       } from 'app/src/constants/PropKeys';
import { MNPQuizSessionQuestion } from 'app/src/constants/NavParams';

import { QuizSessionBookmarkModel } from 'app/src/models/QuizSessionBookmarkModel';


export class QuizSessionQuestionsModal extends React.Component {
  constructor(props){
    super(props);

    const answers       = props[MNPQuizSessionQuestion.answers  ] ?? {};
    const questions     = props[MNPQuizSessionQuestion.questions] ?? [];
    const prevBookmarks = props[MNPQuizSessionQuestion.bookmarks] ?? {};

    const bookmarks = new QuizSessionBookmarkModel();
    bookmarks.setBookmarks(prevBookmarks);
    this.bookmarks = bookmarks;

    this.state = {
      questions  : combineItemsWithQuestions(questions, answers),
      bookmarks  : bookmarks.bookmarkMap,
      updateIndex: 0,
    };
  };

  _handleKeyExtractor = (item, index) => {
    return (item?.questionID ?? index);
  };

  _handleOnPressQuestion = async ({answer, question, index}) => {
    const { componentId, ...props } = this.props;

    const currentQuestion = props[MNPQuizSessionQuestion.currentQuestion];
    const onPressQuestion = props[MNPQuizSessionQuestion.onPressQuestion];

    const nextQuizID = question       [QuizQuestionKeys.questionID];
    const currQuizID = currentQuestion[QuizQuestionKeys.questionID];

    if(currQuizID != nextQuizID){
      // disable swipe gesture
      Navigation.mergeOptions(componentId, {
        modal: {
          swipeToDismiss: false,
        }
      });
      
      onPressQuestion && onPressQuestion({answer, question, index});
    };
    
    // close modal
    Navigation.dismissModal(componentId);
  };

  _handleOnLongPressQuestion = async ({question}) => {
    try {
      const props = this.props;
      let shouldUpdateBookmarks = false;

      const questionID = question[QuizQuestionKeys.questionID];
      const prevBookmarks = this.bookmarks.bookmarkMap;

      const bookmark = prevBookmarks[questionID];
      const isBookmarked = (
        (bookmark != null     ) ||
        (bookmark != undefined)
      );

      if(isBookmarked){
        const confirm = await Helpers.asyncActionSheetConfirm({
          title: '',
          message: "Are you sure that you want to remove the bookmark for this question.",
          confirmText: 'Remove Bookmark',
          isDestructive: true,
        });

        if(confirm){
          this.bookmarks.removeBookmark(questionID);
          shouldUpdateBookmarks = true;
          this.bannerPillRef.show({
            message: 'Bookmark Removed',
            iconKey: iconMapKeys.removed,
          });
        };

      } else {
        this.bookmarks.addBookmark(questionID);
        shouldUpdateBookmarks = true;
        this.bannerPillRef.show({
          message: 'Bookmark Added',
          iconKey: iconMapKeys.bookmark,
          bgColor: Colors.ORANGE.A700,
        });
      };

      if(shouldUpdateBookmarks){
        const updateBookmarks = props[MNPQuizSessionQuestion.updateBookmarks];
        // call updateBookmarks from QuizSessionScreen
        updateBookmarks && updateBookmarks(
          this.bookmarks.bookmarkMap
        );

        this.setState((prevState) => ({
          ...prevState,
          bookmarks  : this.bookmarks.bookmarkMap ,
          updateIndex: (prevState.updateIndex + 1),
        }));
      };

    } catch(error){
      console.log('QuizSessionQuestionsModal - _handleOnLongPressQuestion error');
      console.log('Unable to add bookmark');
      console.log(error);

      Alert.alert(
        'Error Occured',
        'Unable to bookmark question.',
      );
    };
  };

  _renderItem = ({item, index}) => {
    const props = this.props;
    const { bookmarks } = this.state;
    const currentIndex = props[MNPQuizSessionQuestion.currentIndex];

    const question   = item?.question ?? {};
    const questionID = question[QuizQuestionKeys.questionID];

    return(
      <QuestionAnswerItem
        answer={item.answer}
        question={item.question}
        bookmark={bookmarks[questionID]}
        onPressQuestion={this._handleOnPressQuestion}
        onLongPressQuestion={this._handleOnLongPressQuestion}
        {...{index, question, currentIndex}}
      />
    );
  };

  _renderListHeader = () => {
    const props = this.props;
    
    const quiz      = props[MNPQuizSessionQuestion.quiz     ] ?? {};
    const answers   = props[MNPQuizSessionQuestion.answers  ] ?? {};
    const session   = props[MNPQuizSessionQuestion.session  ] ?? {};
    const questions = props[MNPQuizSessionQuestion.questions] ?? [];


    return(
      <Fragment>
        <QuizSessionDetails
          containerStyle={{ marginBottom: 20 }}
          {...{quiz, session, answers, questions}}
        />
        <ModalSection marginBottom={0}>
          <ImageTitleSubtitle
            title={'Question List'}
            subtitle={'You can tap on a list item to jump to that question or long press to add or remove the bookmark it.'}
            hasPadding={false}
            imageSource={require('app/assets/icons/e-window-msg.png')}
          />
        </ModalSection>
      </Fragment>
    );
  };

  _renderListFooter = () => {
    return(
      <ListFooterIcon
        show={true}
        hasEntranceAnimation={false}
      />
    );
  };

  render(){
    const state = this.state;

    const modalHeader = (
      <ModalHeader
        title={'Quiz Questions'}
        subtitle={"Here are all the questions in this quiz"}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-book'}
            size={24}
          />
        )}
      />
    );

    const modalBanner = (
      <BannerPill
        ref={r => this.bannerPillRef = r}
        iconMap={iconMap}
      />
    );

    const overlay = (
      <ViewQuizOverlay
        ref={r => this.overlayRef = r}
      />
    );

    return (
      <ModalBody
        wrapInScrollView={false}
        {...{modalHeader, modalBanner, overlay}}
      >
        <FlatList
          data={state.questions}
          extraData={this.state.updateIndex}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderListHeader}
          ListFooterComponent={this._renderListFooter}
        />
      </ModalBody>
    );
  };
};


// combine questions, answers and bookmarks
function combineItemsWithQuestions(questions, answers){
  return questions.map((question) => {
    const questionID = question[QuizQuestionKeys.questionID];

    return {
      questionID, question, 
      answer: answers[questionID],
    };
  });
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