import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

class AuthLoadingScreen extends Component {
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

class HomeScreen extends Component {
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

const AppStack = createStackNavigator({ 
  homeRoute: HomeScreen, 
});

const rootNavigator = createSwitchNavigator({
    authRoute: AuthLoadingScreen,
    appRoute : AppStack,
  },{
    initialRouteName: 'authRoute',
  }
);

export default createAppContainer(rootNavigator);
