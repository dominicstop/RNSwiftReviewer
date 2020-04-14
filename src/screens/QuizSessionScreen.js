import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export class QuizSessionScreen extends React.Component {
  static navigationOptions = {
    title: 'N/A',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  render(){
    const { styles } = QuizSessionScreen;

    return(
      <View style={styles.rootContainer}>

      </View>
    );
  };
};