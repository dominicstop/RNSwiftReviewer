import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { BarIndicator } from 'react-native-indicators';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { ROUTES } from 'app/src/constants/Routes';

import { QuizStore        } from 'app/src/functions/QuizStore';
import { QuizSessionStore } from 'app/src/functions/QuizSessionStore';


export class AuthLoadingScreen extends Component {
  async componentDidMount(){
    const { navigation } = this.props;
    StatusBar.setBarStyle("light-content");

    await Promise.all([
      this.animatedLoading.zoomIn(1000),
      // preload store data
      QuizStore       .getQuizes  (),
      QuizSessionStore.getSessions(),
    ]);

    navigation.navigate(ROUTES.homeRoute);
  };

  render(){
    return(
      <Animatable.View 
        style={styles.rootContainer}
        animation={'fadeIn'}
        duration={500}
        useNativeDriver={true}
      >
        <Animatable.View
          ref={r => this.animatedLoading = r}
          style={styles.indicatorContainer}
          useNativeDriver={true}
        >
          <BarIndicator 
            color='white'
            count={8}
            size={55}
            animationDuration={1500}
          />
        </Animatable.View>
      </Animatable.View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: Colors.INDIGO.A700,
  },
  indicatorContainer: {
    flex: 1,
  },
});