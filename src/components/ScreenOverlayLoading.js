import React from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from 'react-native-reanimated';

import { Easing } from 'react-native-reanimated';
import { BlurView } from "@react-native-community/blur";

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { HeaderValues } from 'app/src/constants/HeaderValues';

const { Value, Extrapolate, interpolate, timing } = Reanimated;

const headerHeight = HeaderValues.getHeaderHeight(true);
const { height: screenHeight } = Dimensions.get('screen');


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
    paddingLeft: 4,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    aspectRatio: 1,
    width: 50,
    borderRadius: 50/2,
  },
});

export class ScreenOverlayLoading extends React.PureComponent {
  static propTypes = {
    excludeHeader: PropTypes.bool,
  };

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
      duration: 200,
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
    const props = this.props;
    const { mount } = this.state;

    if(!mount) return null;

    const overlayContainerStyle = {
      opacity: this._opacity,
      ...(props.excludeHeader && {
        top: headerHeight,
        height: (screenHeight - headerHeight),
      })
    };

    const loadingContainer = {
      ...(props.excludeHeader && {
        // center loading indicator
        marginBottom: headerHeight,
      })
    };

    return (
      <Reanimated.View 
        style={[styles.overlayContainer, overlayContainerStyle]}
        pointerEvents={'auto'}
      >
        <BlurView
          style={styles.blurBackground}
          blurType={'light'}
          blurAmount={5}
        />
        <View style={[styles.loadingContainer, loadingContainer]}>
          <ActivityIndicator
            size={'large'}
            color={Colors.BLUE.A700}
          />
        </View>
      </Reanimated.View>
    );
  };
};