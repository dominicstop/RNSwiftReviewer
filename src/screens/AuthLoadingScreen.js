import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import * as Font from 'expo-font';

import * as COLORS  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { ROUTES } from 'app/src/constants/Routes';

export class AuthLoadingScreen extends Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.INDIGO.A700
    },
  });

  async componentDidMount(){
    const { navigation } = this.props;
    StatusBar.setBarStyle("light-content");

    await Promise.all([
      Helpers.timeout(750),
    ]);

    navigation.navigate(ROUTES.homeRoute);
  };

  render() {
    const { styles } = AuthLoadingScreen;

    return (
      <View style={styles.rootContainer}>
        <Text>AuthLoadingScreen</Text>
      </View>
    );
  };
};