import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export class HomeScreen extends Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  render() {
    const { styles } = HomeScreen;

    return (
      <View style={styles.rootContainer}>
        <Text>HomeScreen</Text>
      </View>
    );
  };
};