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

    this.session = session;

    this.state = {
      currentIndex: 0,
      questions: session.questions,
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
    const { currentIndex } = this.state;

    return(
      <QuizQuestionItem
        isFocused={(currentIndex == index)}
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