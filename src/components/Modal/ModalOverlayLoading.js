import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import Reanimated from 'react-native-reanimated';

import { Easing } from 'react-native-reanimated';
import { VibrancyView } from "@react-native-community/blur";

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

const { Value, Extrapolate, interpolate, timing } = Reanimated;

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BLUE[50],
    aspectRatio: 1,
    width: 60,
    borderRadius: 60/2,
  },
});

export class ModalOverlayLoading extends React.PureComponent {
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
        <VibrancyView
          style={styles.blurBackground}
          blurType={'regular'}
          blurAmount={0}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size={'large'}
            color={Colors.BLUE.A700}
          />
        </View>
      </Reanimated.View>
    );
  };
};