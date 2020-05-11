import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from 'react-native-reanimated';

import { BlurView } from "@react-native-community/blur";

import { VibrancyView } from "@react-native-community/blur";
import { Transitioning, Transition, Easing } from 'react-native-reanimated';
import { ModalLargeTitleHeader } from './ModalLargeTitleHeader';

const { concat, floor, Extrapolate, interpolate, Value, event, block, set, divide, add, sub, debug } = Reanimated;
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');


const MODAL_HEADER_HEIGHT_EXPANDED  = 80;
const MODAL_HEADER_HEIGHT_COLLAPSED = 50;

export class ModalLargeTitleBody extends React.Component {
  static styles = StyleSheet.create({
    scrollable: {
      
    },
    blurBackground: {
      ...StyleSheet.absoluteFillObject,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(252,252,252,0.7)',
    },
  });

  constructor(props){
    super(props);

    this.state = {
      enableSnap: true,
    };

    this._scrollY = new Value(0);

    this._handleOnScroll = event([{ 
      nativeEvent: ({contentOffset: {y}}) => block([
        set(this._scrollY, y),
      ])
    }]);

    const progress = interpolate(this._scrollY, {
      inputRange: [0, MODAL_HEADER_HEIGHT_EXPANDED],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });

    this._spacerMarginTop = interpolate(progress, {
      inputRange: [0, 100],
      outputRange: [0, MODAL_HEADER_HEIGHT_COLLAPSED]
    });
  };

  _renderListHeader = () => {
    const { styles } = ModalLargeTitleBody;
    //const { renderHeader } = this.props;

    return(
      <View style={[styles.listHeader, {marginTop: MODAL_HEADER_HEIGHT_EXPANDED}]}>
      </View>
    );
  };

  render(){
    const { styles } = ModalLargeTitleBody;
    const { ...props } = this.props;
    const { enableSnap } = this.state;

    const scrollableStyle = {
      transform: [
      ],
    };

    //get scrollable child
    const children   = React.Children.toArray(props.children);
    const scrollable = children[0];

    const Scrollable = React.cloneElement(scrollable, {
      style: [styles.scrollable, scrollableStyle],
      // attach event REA listeners
      onScrollEndDrag: this._handleOnScrollEndDrag,
      onScroll       : this._handleOnScroll       ,
      // render + handlers
      ListHeaderComponent: this._renderListHeader,
      //adjust insets + offsets
      scrollIndicatorInsets: {
        top   : MODAL_HEADER_HEIGHT_EXPANDED,
        //bottom: TB_HEIGHT_ADJ + EXTRA_HEIGHT,
      },
      //config scrollview
      scrollEventThrottle: 1,
      disableScrollViewPanResponder: true,
      // snaping behaviour
      snapToEnd   : false,
      snapToStart : true ,
      scrollsToTop: false,
      snapToAlignment: 'center',
      ...(enableSnap && {
        snapToOffsets: [0, MODAL_HEADER_HEIGHT_EXPANDED],
      }),
    });

    return(
      <View>
        <Reanimated.View style={{
          marginTop: this._spacerMarginTop
        }}/>
        <BlurView 
          style={styles.blurBackground}
          blurType={'light'}
          blurAmount={75}
        />
        <View style={styles.background}/>
        <View>
          {Scrollable}
        </View>
        <ModalLargeTitleHeader
          scrollY={this._scrollY}
        />
      </View>
    );
  };
};