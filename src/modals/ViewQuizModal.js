import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import { ROUTES } from 'app/src/constants/Routes';

export class ViewQuizModal extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,255,255,0.75)',
    },
  });

  render(){
    const { styles } = ViewQuizModal;

    return (
      <View style={styles.rootContainer}>
        <ScrollView>
          <Text>ViewQuizModal</Text>
          <Text>ViewQuizModal</Text>
          <Text>ViewQuizModal</Text>
          <Text>ViewQuizModal</Text>
        </ScrollView>
      </View>
    );
  };
};
