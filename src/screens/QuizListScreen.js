import React from 'react';
import { StyleSheet, Text, View, Clipboard } from 'react-native';

import { ROUTES } from 'app/src/constants/Routes';
import { ModalController } from 'app/src/functions/ModalController';


export class QuizListScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'blue',
    },
  });

  static navigationOptions = {
    title: 'Quiz'
  };

  _handleOnPressNavigate = () => {
    ModalController.showModal();
  };

  render() {
    const { styles } = QuizListScreen;

    return (
      <View style={styles.rootContainer}>
        <Text onPress={this._handleOnPressNavigate}>Nav to CreateQuizScreen</Text>
      </View>
    );
  };
};