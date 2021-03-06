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
    backgroundColor: 'white',
    paddingLeft: 4,
    paddingTop: 4,
    aspectRatio: 1,
    width: 55,
    borderRadius: 55/2,
  },
});

export class ModalOverlayLoading extends React.PureComponent {
  constructor(props){
    super(props);

    this.progress = new Value(0);

    this._opacity = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [0, 1 ],
    });

    this.state = {
      mount: false
    };
  };

  setVisibility = async (visibility) => {
    visibility && await Helpers.setStateAsync(this,
      { mount: true }
    );

    const animation = timing(this.progress, {
      easing  : Easing.inOut(Easing.ease),
      toValue : (visibility? 100 : 0),
      duration: 300,
    });

    await new Promise(resolve => {
      animation.start(() => {
        resolve();
      });
    });

    !visibility && await Helpers.setStateAsync(this,
      { mount: false }
    );
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
          blurType={'light'}
          blurAmount={3}
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