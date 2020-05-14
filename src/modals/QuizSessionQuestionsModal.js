import React, { Fragment } from 'react';
import { FlatList } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { ModalBody          } from 'app/src/components/Modal/ModalBody';
import { ModalHeader        } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter        } from 'app/src/components/Modal/ModalFooter';
import { ModalSection       } from 'app/src/components/Modal/ModalSection';

import { ViewQuizOverlay     } from 'app/src/components/ViewQuizModal/ViewQuizOverlay';

import { ListFooterIcon } from 'app/src/components/ListFooterIcon';
import { QuizSessionDetails } from 'app/src/components/QuizSessionDoneModal/QuizSessionDetails';

import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { MNPQuizSessionQuestion } from 'app/src/constants/NavParams';

import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';
import { QuestionAnswerItem } from 'app/src/components/QuizSessionDoneModal/QuestionAnswerItem';


// combine questions, answers and bookmarks
function combineItemsWithQuestions(questions, answers, bookmarks){
  return questions.map((question) => {
    const questionID = question[QuizQuestionKeys.questionID];

    return {
      questionID, question, 
      answer  : answers  [questionID],
      bookmark: bookmarks[questionID],
    };
  });
};

export class QuizSessionQuestionsModal extends React.Component {
  constructor(props){
    super(props);

    const answers   = props[MNPQuizSessionQuestion.answers  ] ?? {};
    const bookmarks = props[MNPQuizSessionQuestion.bookmarks] ?? {};
    const questions = props[MNPQuizSessionQuestion.questions] ?? [];

    this.state = {
      questions: 
        combineItemsWithQuestions(questions, answers, bookmarks)
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

  _renderItem = ({item, index}) => {
    const props = this.props;
    const currentIndex = props[MNPQuizSessionQuestion.currentIndex];

    return(
      <QuestionAnswerItem
        onPressQuestion={this._handleOnPressQuestion}
        answer={item.answer}
        question={item.question}
        bookmark={item.bookmark}
        {...{index, currentIndex}}
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
            color={'white'}
          />
        )}
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
        {...{modalHeader, overlay}}
      >
        <FlatList
          data={state.questions}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderListHeader}
          ListFooterComponent={this._renderListFooter}
        />
      </ModalBody>
    );
  };
};