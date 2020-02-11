import React from 'react';
import { StyleSheet, Text, View, Clipboard } from 'react-native';

import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';

import { QuizListScreen } from 'app/src/screens/QuizListScreen';
import { ExamListScreen } from 'app/src/screens/ExamListScreen';
import { CustomTabBar } from 'app/src/components/CustomTabBar';

import { ROUTES } from 'app/src/constants/Routes';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';


function getNavigationOptionFromRoute(routeKey){
  switch (routeKey) {
    case ROUTES.TabExamRoute: return {
      headerTitle: 'Exams',
      iconNames: [
        SVG_KEYS.NewsPaperOutline,
        SVG_KEYS.NewsPaperFilled ,
      ],
    };
    case ROUTES.TabQuizRoute: return {
      headerTitle: 'Quizes',
      iconNames: [
        SVG_KEYS.DocumentTextOutline,
        SVG_KEYS.DocumentTextFilled ,
      ],
    };
    default: return {
      headerTitle: 'Unknown',
      iconNames: ['', ''],
    };
  }
};

function getTabBarIcon({focused, horizontal, tintColor}, navigation){
  const { routeName } = navigation.state;  
  const { iconNames: [iconInactive, iconActive] } = getNavigationOptionFromRoute(routeName);

  return (
    <SvgIcon 
      name={(focused? iconActive : iconInactive)}
      stroke={tintColor}
      size={30}
    />
  );
};

const HomeScreen = createBottomTabNavigator({
    [ROUTES.TabQuizRoute]: QuizListScreen,
    [ROUTES.TabExamRoute]: ExamListScreen,
  }, {
    initialRouteName: ROUTES.QuizListScreen,
    tabBarComponent: CustomTabBar,
    defaultNavigationOptions: ({navigation}) => ({
      //render tab icons based on route
      tabBarIcon: (options) => getTabBarIcon(options, navigation),
    }),
    tabBarOptions: {
      style: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        activeTintColor  : 'rgba(0,0,0,0.9)',
        inactiveTintColor: 'rgba(0,0,0,0.3)',
      },
      safeAreaInset: {
        bottom: 'never',
      },
    },
  }
);

HomeScreen.navigationOptions = ({navigation}) => {
  const { state } = navigation;

  //get current route
  const { routeName } = state.routes[state.index];
  const options = getNavigationOptionFromRoute(routeName);

  //Clipboard.setString(JSON.stringify(state.routes[state.index]));

  return {
    title: options.headerTitle,
    headerTitle: null,
  };
};

export { HomeScreen };


