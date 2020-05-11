import React from 'react';
import { StyleSheet, Animated } from 'react-native';

import LottieView from 'lottie-react-native';

import * as Helpers from 'app/src/functions/helpers';

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  overlay: {
  },
});

// used in components/ModalBody as prop for modalOverlay
// shows a check overlay animation
export class ModalOverlayCheck extends React.PureComponent {
  constructor(props){
    super(props);

    this.state = {
      mount: false
    };

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

    await Helpers.setStateAsync(this, {
      mount: true
    });

    await new Promise(resolve => {
      animation.start(() => {
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
      <Animated.View 
        style={[styles.overlayContainer, overlayContainerStyle]}
        pointerEvents={'auto'}
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