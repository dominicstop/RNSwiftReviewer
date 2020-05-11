import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import Reanimated from 'react-native-reanimated';

import * as Colors from 'app/src/constants/Colors';

import { VibrancyView } from "@react-native-community/blur";
import { Transitioning, Transition, Easing } from 'react-native-reanimated';
import { BORDER_WIDTH } from 'app/src/constants/UIValues';

const { concat, floor, Extrapolate, interpolate, Value, event, block, set, divide, add, sub, debug } = Reanimated;
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const MODAL_HEADER_HEIGHT_EXPANDED  = 80;
const MODAL_HEADER_HEIGHT_COLLAPSED = 50;


export class ModalLargeTitleHeader extends React.Component {
  static propTypes = {
    scrollY: PropTypes.object,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      paddingTop: 3,
      paddingHorizontal: 10,
      height: MODAL_HEADER_HEIGHT_EXPANDED,
      backgroundColor: 'rgba(255,255,255, 0.8)',
      // border
      borderColor: Colors.GREY[400],
      borderBottomWidth: BORDER_WIDTH,
      // float top
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    dragIndicator: {
      width: 40,
      height: 6,
      backgroundColor: Colors.BLUE[900],
      borderRadius: 10,
      opacity: 0.25,
      alignSelf: 'center',
      marginTop: 7,
      position: 'absolute',
    },
    titleSubtitleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textTitle: {
      fontWeight: '800',
      color: Colors.BLUE.A700
    },
    textSubtitle: {
      marginTop: -2,
      color: Colors.GREY[700]
    },
  });

  constructor(props){
    super(props);

    const progress = interpolate(props.scrollY, {
      inputRange: [0, MODAL_HEADER_HEIGHT_EXPANDED],
      outputRange: [0, 100],
    });

    this._scale = interpolate(props.scrollY, {
      inputRange: [-100, 0],
      outputRange: [1.25, 1],
      extrapolate: Extrapolate.CLAMP,
    });

    this._translateX = interpolate(props.scrollY, {
      inputRange: [-100, 0],
      outputRange: [(0.1 * screenWidth), 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this._height = interpolate(progress, {
      inputRange: [0, 100],
      outputRange: [MODAL_HEADER_HEIGHT_EXPANDED, MODAL_HEADER_HEIGHT_COLLAPSED],
      extrapolateLeft : Extrapolate.EXTEND,
      extrapolateRight: Extrapolate.CLAMP,
    });

    this._titleFontSize = interpolate(progress, {
      inputRange: [0, 100],
      outputRange: [24, 18],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleFontWeight = floor(
      interpolate(progress, {
        inputRange : [50, 75],
        outputRange: [8, 7],
        extrapolate: Extrapolate.CLAMP,
      })
    );

    this._subtitleFontSize = interpolate(progress, {
      inputRange: [0, 100],
      outputRange: [14, 1],
      extrapolate: Extrapolate.CLAMP,
    });

    this._subtitleHeight = interpolate(progress, {
      inputRange: [0, 100],
      outputRange: [-1, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this._subtitleOpacity = interpolate(progress, {
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });
  };

  render(){
    const { styles } = ModalLargeTitleHeader;

    const rootContainerStyle = {
      height: this._height,
      transform: [
        { scale: this._scale },
        { translateX: this._translateX },
        //{ translateY: this._translateY },
      ],
    };

    const textTitleStyle = {
      fontSize: this._titleFontSize,
      fontWeight: '800'// concat(this._titleFontWeight, '00'),
    };

    const textSubtitleStyle = {
      fontSize: this._subtitleFontSize,
      height: this._subtitleHeight,
      opacity: this._subtitleOpacity,
    };

    return (
      <Fragment>
        <Reanimated.View style={[styles.rootContainer, rootContainerStyle]}>
          <View style={styles.titleSubtitleContainer}>
            <Reanimated.Text style={[styles.textTitle, textTitleStyle]}>
              {'View Quiz'}
            </Reanimated.Text>
            <Reanimated.Text style={[styles.textSubtitle, textSubtitleStyle]}>
              {'Tap on lorum ipsum sit amit'}
            </Reanimated.Text>
          </View>
        </Reanimated.View>
        <Animatable.View 
          style={styles.dragIndicator}
          animation={'pulse'}
          duration={2000}
          iterationCount={'infinite'}
          iterationDelay={2000}
          useNativeDriver={true}
        />
      </Fragment>
    );
  };
};
