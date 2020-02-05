import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export class AuthLoadingScreen extends Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  render() {
    const { styles } = AuthLoadingScreen;

    return (
      <View style={styles.rootContainer}>
        <Text>AuthLoadingScreen</Text>
      </View>
    );
  };
};