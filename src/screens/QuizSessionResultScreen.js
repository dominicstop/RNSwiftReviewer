import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { ListCard } from 'app/src/components/ListCard';
import { ResultSummary } from 'app/src/components/QuizSessionResultScreen/ResultSummary';


import { HeaderValues } from 'app/src/constants/HeaderValues';
import { SNPQuizSessionResult } from '../constants/NavParams';
import { QuizSessionKeys, QuizSessionScoreKeys } from '../constants/PropKeys';


const HEADER_HEIGHT = HeaderValues.getHeaderHeight(false);


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
        <ResultSummary
          {...{session}}
        />
      </ScrollView>
    );
  };
};