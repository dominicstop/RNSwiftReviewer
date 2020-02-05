import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

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
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={300}
          interpolation="easeIn"
        />
        <Transition.In 
          type="fade" 
          durationMs={750} 
        />
      </Transition.Together>
    ),
  }
);

export default createAppContainer(rootNavigator);
