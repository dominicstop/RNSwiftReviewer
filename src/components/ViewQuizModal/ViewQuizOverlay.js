import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

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
    shadowColor: 'rgba(0,0,0,0.23)',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2.62,
  },
  overlay: {
  },
});

export class ViewQuizOverlay extends React.PureComponent {
  constructor(props){
    super(props);

    const progress = new Value(0);

    this._opacity = interpolate(progress, {
      inputRange : [0, 100],
      outputRange: [0, 1 ],
    });

    this._translateY = interpolate(progress, {
      inputRange : [0, 100],
      outputRange: [500, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this._scale = interpolate(progress, {
      inputRange : [0, 100],
      outputRange: [0.3, 1],
      extrapolate: Extrapolate.CLAMP,
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
        <Reanimated.View style={[styles.loadingContainer, [{
          transform: [
            { scale     : this._scale      },
            { translateY: this._translateY },
          ],
        }]]}>
          <ActivityIndicator
            style={{marginLeft: 5, marginTop: 5}}
            size={"large"} 
            color={Colors.INDIGO.A700}
          />
        </Reanimated.View>
      </Reanimated.View>
    );
  };
};