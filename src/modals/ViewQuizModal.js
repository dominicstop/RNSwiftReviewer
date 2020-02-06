import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import { ROUTES } from 'app/src/constants/Routes';

export class ViewQuizModal extends React.Component {
  static options() {
    return {
    };
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,255,255,0.5)',
    },
    headerContainer: {
      paddingVertical: 10,
    },
  });

  _handleOnPressCloseModal = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTES.appStackRoute);
  };

  render(){
    const { styles } = ViewQuizModal;

    return (
      <View style={styles.rootContainer}>
        <View style={styles.headerContainer}>
          <Text>Header</Text>
        </View>
        <ScrollView>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
          <Text
            onPress={this._handleOnPressCloseModal}
          >
            Close Modal
          </Text>
        </ScrollView>
      </View>
    );
  };
};
