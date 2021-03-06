import React from 'react';
import { StyleSheet, Animated } from 'react-native';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import LottieView from 'lottie-react-native';

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    zIndex: 999,
  },
  overlay: {
  },
});

// shows a check overlay animation
export class ScreenOverlayCheck extends React.PureComponent {
  constructor(props){
    super(props);

    this.progress = new Animated.Value(0);

    this._opacity = this.progress.interpolate({
      inputRange : [0, 0.25],
      outputRange: [0, 1  ],
    });

    this.lottieSource = require('app/assets/lottie/check_done.json');
  };

  start = async (duration = 750) => {
    const animation = Animated.timing(this.progress, {
      duration,
      toValue: 1
    });

    await new Promise(resolve => {
      animation.start(() => {
        resolve();
      });
    });
  };

  render(){
    const overlayContainerStyle = {
      opacity: this._opacity,
    };

    return (
      <Animated.View 
        style={[styles.overlayContainer, overlayContainerStyle]}
        pointerEvents={'none'}
      >
        <LottieView
          ref={r => this.lottieRef = r}
          progress={this.progress}
          source={this.lottieSource}
        />
      </Animated.View>
    );
  };
};