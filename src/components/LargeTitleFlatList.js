import React, { Fragment } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { BlurView, VibrancyView } from "@react-native-community/blur";


import { ScrollView } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';
const { concat, floor, Extrapolate, interpolate, spring, neq, diffClamp, debug, add, cond, diff, divide, eq, event, exp, lessThan, and, call, block, multiply, pow, set, abs, clockRunning, greaterOrEq, lessOrEq, sqrt, startClock, stopClock, sub, Clock, Value, or, timing } = Animated;

const { width: screenWidth } = Dimensions.get('screen');

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const SBAR_HEIGHT   = 20;
const NAVBAR_LARGE  = 125;
const NAVBAR_NORMAL = 65;
const NAVBAR_ADJ    = (NAVBAR_NORMAL - SBAR_HEIGHT  ); 
const NAVBAR_DIFF   = (NAVBAR_LARGE  - NAVBAR_NORMAL);


export class LargeTitleWithSnap extends React.PureComponent {
  static propTypes = {
    titleText     : PropTypes.string,
    subtitleText  : PropTypes.string,
    subtitleHeight: PropTypes.number,
    showSubtitle  : PropTypes.bool  ,
    renderSubtitle: PropTypes.func  ,
  };

  static defaultProps = {
    subtitleHeight: 30,
    titleText: 'Title',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    dummyItem1: {
      width: '100%',
      height: 50,
    },
    headerContainer: {
      position: "absolute",
      width: '100%',
      overflow: 'hidden',
    },
    background: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
    },
    subtitleContainer: {
      //backgroundColor: 'green',
      position: 'absolute',
      width: '100%',
      marginLeft: 10,
      overflow: 'hidden',
      bottom: 0,
    },
    //controls horizontal alignment
    titleWrapper: {
      //backgroundColor: 'blue',
      position: "absolute",
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    //controls vertical alignment
    titleContainer: {
      //backgroundColor: 'orange',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginLeft: 10,
    },
    titleLarge: {
      //backgroundColor: 'yellow',
      fontSize: 34,
      fontWeight: '900',
    },
    subtitleText: {
      fontSize: 20,
      fontWeight: '400',
      opacity: 0.8,
    },
  });

  constructor(props){
    super(props);

    const subtitleHeight = (props.showSubtitle? props.subtitleHeight : 0);
    const NAVBAR_FHEIGHT = (NAVBAR_LARGE + subtitleHeight);

    this._titleLargeWidth  = new Value(-1);
    this._titleLargeHeight = new Value(-1);
    this._scrollY          = new Value(0 );

    this._diffClampY = diffClamp(this._scrollY, 0, NAVBAR_LARGE);
    
    this._handleOnScroll = event([{ 
      nativeEvent: ({contentOffset: {y}}) => block([
        set(this._scrollY, y),
      ])
    }]);

    this._headerHeight = interpolate(this._scrollY, {
      inputRange      : [0, NAVBAR_NORMAL],
      outputRange     : [NAVBAR_FHEIGHT, NAVBAR_NORMAL],
      extrapolateLeft : Extrapolate.EXTEND,
      extrapolateRight: Extrapolate.CLAMP ,
    });

    this._snapTopHeight = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [(NAVBAR_FHEIGHT - NAVBAR_NORMAL),  NAVBAR_NORMAL],
      extrapolate: Extrapolate.CLAMP
    });

    this._bGOpacity = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [1, 0.75],
      extrapolate: Extrapolate.CLAMP,
    });

    this._subtitleHeight = interpolate(this._scrollY, {
      inputRange      : [0, NAVBAR_NORMAL],
      outputRange     : [subtitleHeight, 0],
      extrapolateLeft : Extrapolate.EXTEND,
      extrapolateRight: Extrapolate.CLAMP ,
    });

    this._subtitleOpacity = interpolate(this._scrollY, {
      inputRange : [0, (NAVBAR_NORMAL/2)],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleTransX = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [0, (screenWidth / 1.8)],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleTransY = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [0, -(NAVBAR_NORMAL / 3.25)],
      extrapolate: Extrapolate.CLAMP,
    });

    const titleMargin      = 10;
    const titleWidthMidIn  = (NAVBAR_NORMAL / 1.35);
    const titleWidthMidOut = divide(add(this._titleLargeWidth, screenWidth), 1.35);
    
    this._headerTitleWidth = interpolate(this._scrollY, {
      inputRange : [0, titleWidthMidIn, NAVBAR_NORMAL],
      outputRange: [this._titleLargeWidth, titleWidthMidOut, screenWidth],
      extrapolate: Extrapolate.CLAMP,
    });
    
    this._titleContainerHeight = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [add(this._titleLargeHeight, titleMargin), NAVBAR_ADJ],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleTransScale = interpolate(this._scrollY, {
      inputRange : [-NAVBAR_NORMAL, 0, NAVBAR_NORMAL],
      outputRange: [1, 1, 0.65],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleFontWeight = floor(
      interpolate(this._scrollY, {
        inputRange : [0, (NAVBAR_NORMAL/2.5), NAVBAR_NORMAL],
        outputRange: [9, 9, 3],
        extrapolate: Extrapolate.CLAMP,
      })
    );
  };

  _handleOnLayoutTitleLarge = ({nativeEvent}) => {
    if(!this._isTitleLargeMeasured){
      const { x, y, width, height } = nativeEvent.layout;
      this._titleLargeHeight.setValue(height);
      this._titleLargeWidth.setValue(width + (width / 6.15) + 10);
      console.log(`
        width: ${width}
        height: ${height}
      `);
      this._isTitleLargeMeasured = true;
    };
  };

  _renderSubtitle(){
    const { styles } = LargeTitleWithSnap;
    const { showSubtitle, renderSubtitle, ...props } = this.props;
    if(!showSubtitle) return null;

    const subtitleContainerStyle = {
      height : this._subtitleHeight ,
      opacity: this._subtitleOpacity,
      transform: [
        { translateX: this._titleTransX },
        { translateY: this._titleTransY }
      ],
    };

    return(
      <Animated.View style={[styles.subtitleContainer, subtitleContainerStyle]}>
        {renderSubtitle? (
          //render custom subtitle comp
          subtitleText()
        ):(
          <Text style={[styles.subtitleText, props.subtitleStyle]}>
            {props.subtitleText}
          </Text>
        )}
      </Animated.View>
    );
  };

  _renderHeader(){
    const { styles } = LargeTitleWithSnap;

    const headerContainerStyle = {
      height: this._headerHeight,
    };

    const backgroundStyle = {
      opacity: this._bGOpacity
    };

    //controls horizontal alignment
    const titleWrapperStyle = {
      height       : this._headerHeight    ,
      width        : this._headerTitleWidth,
      paddingBottom: this._subtitleHeight  ,
    };

    //controls vertical alignment
    const titleContainer = {
      height: this._titleContainerHeight,
      transform: [
        { scale: this._titleTransScale },
      ]
    };

    const titleLarge = {
      fontWeight: concat(this._titleFontWeight, '00')
    };

    return(
      <AnimatedBlurView 
        style={[styles.headerContainer, headerContainerStyle]}
        blurType={"regular"}
        blurAmount={100}
      >
        <Animated.View style={[styles.background, backgroundStyle]}/>
        <Animated.View style={[styles.titleWrapper, titleWrapperStyle]}>
          <Animated.View style={[styles.titleContainer, titleContainer]}>
            <View onLayout={this._handleOnLayoutTitleLarge}>
              <Animated.Text style={[styles.titleLarge, titleLarge]}>
                {this.props.titleText}
              </Animated.Text>
            </View>
          </Animated.View>
        </Animated.View>
        {this._renderSubtitle()}
      </AnimatedBlurView>
    );
  };

  _renderSnapSpacer(){
    const { styles } = LargeTitleWithSnap;
    
    const snapStyle = {
      height: this._snapTopHeight,
    };

    return(
      <View>
        <Animated.View style={[{width: '100%'}, snapStyle]}/>

      </View>
    );
  };

  render(){
    const { styles } = LargeTitleWithSnap;
    const { children } = this.props;

    let ScrollView = React.cloneElement(children, {
      scrollEventThrottle: 1,
      ListHeaderComponent: this._renderSnapSpacer,
      onScroll: this._handleOnScroll,
      onScrollEndDrag: this._handleOnScrollEndDrag,
      snapToOffsets: [NAVBAR_NORMAL],
      scrollIndicatorInsets: {
        top: NAVBAR_NORMAL
      }
    });

    return(
      <View style={styles.rootContainer}>
        {ScrollView}
        {this._renderHeader()}
      </View>
    );
  };
};