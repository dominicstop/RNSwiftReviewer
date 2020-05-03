import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { ListCard } from 'app/src/components/ListCard';
import { HeaderValues } from 'app/src/constants/HeaderValues';
import { SNPQuizSessionResult } from '../constants/NavParams';
import { QuizSessionKeys, QuizSessionScoreKeys } from '../constants/PropKeys';


const HEADER_HEIGHT = HeaderValues.getHeaderHeight(false);




class SessionResults extends React.Component {
  static styles = StyleSheet.create({

  });

  constructor(props){
    super(props);
  };

  render(){
    const { styles } = SessionResults;
    const { session } = this.props;

    const scores = session[QuizSessionKeys.sessionScore];

    const scoreWrong             = scores[QuizSessionScoreKeys.scoreWrong];
    const scoreCorrect           = scores[QuizSessionScoreKeys.scoreCorrect];
    const scoreIncorrect         = scores[QuizSessionScoreKeys.scoreIncorrect];
    const scoreTotalItems        = scores[QuizSessionScoreKeys.scoreTotalItems];
    const scorePercentCorrect    = scores[QuizSessionScoreKeys.scorePercentCorrect];
    const scorePercentUnanswered = scores[QuizSessionScoreKeys.scorePercentUnanswered];
    

    return (
      <ListCard>
        <Text>{'WORK IN PROGRESS'}</Text>
        <Text>{`scoreWrong: ${scoreWrong}`}</Text>
        <Text>{`scoreCorrect: ${scoreCorrect}`}</Text>
        <Text>{`scoreIncorrect: ${scoreIncorrect}`}</Text>
        <Text>{`scoreTotalItems: ${scoreTotalItems}`}</Text>
        <Text>{`scorePercentCorrect: ${scorePercentCorrect}`}</Text>
        <Text>{`scorePercentUnanswered: ${scorePercentUnanswered}`}</Text>
      </ListCard>
    );
  };
};

export class QuizSessionResultScreen extends React.Component {
  static navigationOptions = {
    title: 'Quiz Results',
  };

  render(){
    const { navigation } = this.props;
    const { params } = navigation.state;

    const quiz = params[SNPQuizSessionResult.quiz];
    const session = params[SNPQuizSessionResult.session];
    const sessions = params[SNPQuizSessionResult.sessions];


    return(
      <ScrollView
        contentInset={{ top: HEADER_HEIGHT }}
      >
        <SessionResults
          {...{session}}
        />
      </ScrollView>
    );
  };
};