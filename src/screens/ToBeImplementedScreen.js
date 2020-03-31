import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { QuizStore } from '../functions/QuizStore';

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 28,
  },
  textButton: {
    fontSize: 22,
    padding: 15,
  },
});

export class ToBeImplementedScreen extends React.Component {
  static navigationOptions = {
    title: 'N/A',
  };

  render(){
    return(
      <View style={styles.rootContainer}>
        <Text style={styles.textTitle}>
          {'To Be Implemented 😌'}
        </Text>
        <TouchableOpacity onPress={() => {
          QuizStore.clearQuizes();
        }}>
          <Text style={styles.textButton}>
            {'Clear Store ☹️'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
};