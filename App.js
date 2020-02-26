import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator, HeaderStyleInterpolators, TransitionPresets } from 'react-navigation-stack';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

import { ROUTES } from 'app/src/constants/Routes';
import { INDIGO } from 'app/src/constants/Colors';

import { AuthLoadingScreen } from 'app/src/screens/AuthLoadingScreen';
import { HomeScreen        } from 'app/src/screens/HomeScreen';
import { CreateQuizScreen  } from 'app/src/screens/CreateQuizScreen';

import { ViewQuizModal } from 'app/src/modals/ViewQuizModal';

import { useScreens } from 'react-native-screens';
useScreens();


const AppStack = createStackNavigator({ 
    [ROUTES.homeRoute      ]: HomeScreen, 
    [ROUTES.createQuizRoute]: CreateQuizScreen,
  }, {
    mode: 'card',
    defaultNavigationOptions: {
      headerMode: 'float',
      headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
      headerTransparent: true,
      cardStyle: {
        backgroundColor: INDIGO[50],
      },
    },
  }
);

const AppModalStack = createStackNavigator({ 
    [ROUTES.appStackRoute     ]: AppStack     ,
    [ROUTES.modalViewQuizRoute]: ViewQuizModal,
  }, {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.ModalPresentationIOS,
      gestureEnabled: true,
      cardOverlayEnabled: true,
    },
  }
);

const rootNavigator = createAnimatedSwitchNavigator({
    [ROUTES.authRoute]: AuthLoadingScreen,
    [ROUTES.appRoute ]: AppModalStack,
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
