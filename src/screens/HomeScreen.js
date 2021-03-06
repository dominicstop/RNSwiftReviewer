import React from 'react';
import { StyleSheet, Text, View, Clipboard } from 'react-native';

import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';

import { CustomTabBar } from 'app/src/components/CustomTabBar';

import { QuizListScreen        } from 'app/src/screens/QuizListScreen';
import { ExamListScreen        } from 'app/src/screens/ExamListScreen';
import { ToBeImplementedScreen } from 'app/src/screens/ToBeImplementedScreen';

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
    case ROUTES.TabOptionsRoute: return {
      headerTitle: 'Options',
      iconNames: [
        SVG_KEYS.SettingsOutlined,
        SVG_KEYS.SettingsFilled  ,
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
      stroke={'white'}
      fill={'white'}
      size={30}
    />
  );
};

const HomeScreen = createBottomTabNavigator({
    [ROUTES.TabQuizRoute   ]: QuizListScreen,
    [ROUTES.TabExamRoute   ]: ToBeImplementedScreen,
    [ROUTES.TabOptionsRoute]: ToBeImplementedScreen,
  }, {
    initialRouteName: ROUTES.QuizListScreen,
    tabBarComponent: (props) => <CustomTabBar {...props}/>,
    defaultNavigationOptions: ({navigation}) => ({
      //render tab icons based on route
      tabBarIcon: (options) => getTabBarIcon(options, navigation),
    }),
    tabBarOptions: {
      style: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        activeTintColor  : 'white',
        inactiveTintColor: 'white',
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

  return {
    title: options.headerTitle,
    headerShown: false,
  };
};

export { HomeScreen };


