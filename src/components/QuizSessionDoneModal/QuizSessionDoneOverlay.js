import React from 'react';
import { StyleSheet } from 'react-native';

import Reanimated from 'react-native-reanimated';
import { Easing } from 'react-native-reanimated';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

const { Value, Extrapolate, interpolate, timing } = Reanimated;

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  loadingContainer: {
    width: 55,
    height: 55,
    borderRadius: 55/2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  overlay: {
  },
});

export class QuizSessionDoneOverlay extends React.PureComponent {
  constructor(props){
    super(props);

    const progress = new Value(0);

    this._opacity = interpolate(progress, {
      inputRange : [0, 100],
      outputRange: [0, 1 ],
    });

    this.animation = timing(progress, {
      easing  : Easing.inOut(Easing.ease),
      duration: 300,
      toValue : 100,
    });

    this.state = {
      mount: false
    };
  };

  show = async () => {
    await Helpers.setStateAsync(this, {
      mount: true
    });

    await new Promise(resolve => {
      this.animation.start(() => {
        resolve();
      });
    });
  };

  render(){
    const { mount } = this.state;
    if(!mount) return null;

    const overlayContainerStyle = {
      opacity: this._opacity,
    };

    return (
      <Reanimated.View 
        style={[styles.overlayContainer, overlayContainerStyle]}
        pointerEvents={'auto'}
      >
  
      </Reanimated.View>
    );
  };
};