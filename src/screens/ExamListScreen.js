import React from 'react';
import { StyleSheet, Text, View, Clipboard } from 'react-native';

import { ROUTES } from 'app/src/constants/Routes';


export class ExamListScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  static navigationOptions = {
    title: 'Exam',
  };

  render() {
    const { styles } = ExamListScreen;

    return (
      <View style={styles.rootContainer}>
        <Text>ExamListScreen</Text>
      </View>
    );
  };
};