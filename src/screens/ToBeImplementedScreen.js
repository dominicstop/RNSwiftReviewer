import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 32,
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
      </View>
    );
  };
};