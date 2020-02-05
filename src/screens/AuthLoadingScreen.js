import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

    await Helpers.timeout(750);
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