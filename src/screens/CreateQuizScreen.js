import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as COLORS  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz } from 'app/src/constants/NavParams';

export class CreateQuizScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    headerMode: 'float',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.INDIGO.A700
    },
  });

  componentDidMount(){
    const { navigation } = this.props;
    const { params } = navigation.state;

    const title = params[SNPCreateQuiz.quizTitle];
    const desc  = params[SNPCreateQuiz.quizDesc ];
    
  };

  render() {
    const { styles } = CreateQuizScreen;

    return (
      <View style={styles.rootContainer}>
        <Text>CreateQuizScreen</Text>
      </View>
    );
  };
};