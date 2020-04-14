import React from 'react';

import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, HeaderStyleInterpolators } from 'react-navigation-stack';
import { Transition } from 'react-native-reanimated';

import { ROUTES } from 'app/src/constants/Routes';
import { INDIGO } from 'app/src/constants/Colors';

import { NavHeader } from 'app/src/components/NavHeader';

import { AuthLoadingScreen } from 'app/src/screens/AuthLoadingScreen';
import { HomeScreen        } from 'app/src/screens/HomeScreen';
import { CreateQuizScreen  } from 'app/src/screens/CreateQuizScreen';
import { QuizSessionScreen } from 'app/src/screens/QuizSessionScreen';

import { enableScreens } from 'react-native-screens';
enableScreens();


const AppStack = createStackNavigator({ 
    [ROUTES.homeRoute       ]: HomeScreen       ,
    [ROUTES.createQuizRoute ]: CreateQuizScreen ,
    [ROUTES.quizSessionRoute]: QuizSessionScreen,
  }, {
    mode: 'card',
    defaultNavigationOptions: {
      headerMode: 'float',
      headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
      headerTransparent: true,
      cardStyle: {
        backgroundColor: INDIGO[50],
      },
      headerTintColor: 'white',
      headerBackground: (props) => (
        <NavHeader {...props}/>
      ),
    },
  }
);

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
          durationMs={300} 
        />
      </Transition.Together>
    ),
  }
);

export default createAppContainer(rootNavigator);
