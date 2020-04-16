import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import { FlatListCarousel  } from 'app/src/components/QuizSessionScreen/FlatListCarousel';
import { QuizQuestionItem  } from 'app/src/components/QuizSessionScreen/QuizQuestionItem';
import { QuizSessionHeader } from 'app/src/components/QuizSessionScreen/QuizSessionHeader';

import * as Helpers from 'app/src/functions/helpers';

import { QuizSessionModel } from 'app/src/models/QuizSession';

import { SNPQuizSession   } from 'app/src/constants/NavParams';
import { QuizQuestionKeys } from 'app/src/constants/PropKeys';


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

    const [a, b] = session.questionsRemaining;

    const questionsCurrent = [a, b];
    this.session = session;

    this.state = {
      currentIndex: 0,
      listQuestions: questionsCurrent,
    };
  };

  _handleKeyExtractor = (item, index) => (
    item[QuizQuestionKeys.questionID]
  );

  _handleSnap = ({index}) => {
    this.setState({
      currentIndex: index
    });
  };

  _handleOnBeforeSnap = ({nextIndex}) => {
    this.setState({
      currentIndex: nextIndex,
    });
  };

  _renderItem = ({item, index}) => {
    return(
      <QuizQuestionItem
        {...{index, ...item}}
      />
    );
  };

  render(){
    const { styles } = QuizSessionScreen;
    const { currentIndex, listQuestions: data } = this.state;


    return(
      <View style={styles.rootContainer}>
        <FlatListCarousel
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderItem}
          onSnap={this._handleSnap}
          onBeforeSnap={this._handleOnBeforeSnap}
          {...{data}}
        />
        <QuizSessionHeader
          totalCount={data.length}
          currentIndex={(currentIndex + 1)}
        />
      </View>
    );
  };
};