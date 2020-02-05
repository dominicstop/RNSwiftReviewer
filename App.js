import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

import { ROUTES } from 'app/src/constants/Routes';

import { AuthLoadingScreen } from 'app/src/screens/AuthLoadingScreen';
import { HomeScreen        } from 'app/src/screens/HomeScreen';

const AppStack = createStackNavigator({ 
  [ROUTES.homeRoute]: HomeScreen, 
});

const rootNavigator = createAnimatedSwitchNavigator({
    [ROUTES.authRoute]: AuthLoadingScreen,
    [ROUTES.appRoute ]: AppStack,
  },{
    initialRouteName: ROUTES.authRoute,
  }
);

export default createAppContainer(rootNavigator);
