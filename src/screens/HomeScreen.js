import React from 'react';
import { StyleSheet, Text, View, Clipboard } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import { QuizListScreen } from 'app/src/screens/QuizListScreen';
import { ExamListScreen } from 'app/src/screens/ExamListScreen';

import { ROUTES } from 'app/src/constants/Routes';

function getNavigationOptionFromKey(routeKey){
  switch (routeKey) {
    case ROUTES.TabExamRoute: return {
      headerTitle: 'Exams',
    };
    case ROUTES.TabQuizRoute: return {
      headerTitle: 'Quizes',
    };
    default: return {
      headerTitle: 'Unknown',
    };
  }
};

const HomeScreen = createBottomTabNavigator({
  [ROUTES.TabQuizRoute]: QuizListScreen,
  [ROUTES.TabExamRoute]: ExamListScreen,
});

HomeScreen.navigationOptions = ({navigation}) => {
  const { state } = navigation;

  //get current route
  const { key, routeName } = state.routes[state.index];
  const options = getNavigationOptionFromKey(key);

  //Clipboard.setString(JSON.stringify(state.routes[state.index]));

  return {
    title: options.headerTitle,
    headerTitle: null,
  };
};

export { HomeScreen };

//#region
/** 
export class HomeScreen extends React.Component {
  static router = TabNavigator.router;

  static navigationOptions = {
    headerShown: true,
  };

  render(){
    const { navigation } = this.props;

    return (
      <TabNavigator {...{navigation}}/>
    );
  };
};
**/
//#endregion

