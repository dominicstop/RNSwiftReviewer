import React, { Fragment } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, SectionList } from 'react-native';
import PropTypes from 'prop-types';

import { HeaderValues } from 'app/src/constants/HeaderValues';
import { GREY, ORANGE, YELLOW } from 'app/src/constants/Colors';

import { BlurView, VibrancyView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import Animated, { Easing } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
const { concat, floor, Extrapolate, interpolate, Value, event, block, set, divide, add } = Animated;

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const AnimatedBlurView       = Animated.createAnimatedComponent(VibrancyView  );
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const EXTRA_HEIGHT  = 30;
const NAVBAR_NORMAL = HeaderValues.getHeaderHeight     (true);
const NAVBAR_LARGE  = HeaderValues.getHeaderHeightLarge(true);

export class LargeTitleWithSnap extends React.PureComponent {
  static propTypes = {
    titleText      : PropTypes.string,
    subtitleText   : PropTypes.string,
    subtitleHeight : PropTypes.number,
    showSubtitle   : PropTypes.bool  ,
    renderSubtitle : PropTypes.func  ,
    renderTitleIcon: PropTypes.func  ,
  };

  static defaultProps = {
    subtitleHeight: 30,
    titleText: 'Large Title',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      height: screenHeight + EXTRA_HEIGHT,
    },
    headerContainer: {
      position: "absolute",
      width: '100%',
      overflow: 'hidden',
      borderBottomColor: GREY[500],
      borderBottomWidth: 1,
    },
    background: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    subtitleContainer: {
      //backgroundColor: 'green',
      position: 'absolute',
      width: '100%',
      marginLeft: 10,
      overflow: 'hidden',
      bottom: 0,
    },
    titleIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //marginBottom: 3,
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
    },
    listHeader: {
      width: '100%', 
      backgroundColor: 'white'
    },
  });

  constructor(props){
    super(props);

    const subtitleHeight = (props.showSubtitle? props.subtitleHeight : 0);
    const NAVBAR_FHEIGHT = (NAVBAR_LARGE + subtitleHeight);

    this._titleLargeWidth  = new Value(-1);
    this._titleLargeHeight = new Value(-1);
    this._scrollY          = new Value(0 );

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

    const diff   = (NAVBAR_FHEIGHT - NAVBAR_NORMAL);
    const offset = (diff - NAVBAR_NORMAL);

    this._sectionListTransY = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [offset, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this._bGOpacity = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [0.9, 0.7],
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
      outputRange: [0, -((NAVBAR_NORMAL / 3.25))],
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
    
    const NAVBAR_ADJ = HeaderValues.getHeaderHeight(false);
    this._titleContainerHeight = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [add(this._titleLargeHeight, titleMargin), NAVBAR_ADJ],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleTransScale = interpolate(this._scrollY, {
      inputRange : [-NAVBAR_NORMAL, 0, NAVBAR_NORMAL],
      outputRange: [1.045, 1, 0.65],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleFontWeight = floor(
      interpolate(this._scrollY, {
        inputRange : [0, (NAVBAR_NORMAL/4), NAVBAR_NORMAL],
        outputRange: [9, 9, 4],
        extrapolate: Extrapolate.CLAMP,
      })
    );
  };

  _handleOnLayoutTitleLarge = ({nativeEvent}) => {
    if(!this._isTitleLargeMeasured){
      const { x, y, width, height } = nativeEvent.layout;

      this._titleLargeHeight.setValue(height);
      this._titleLargeWidth.setValue(width + (width / 6.15) + 10);

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
    const { renderTitleIcon } = this.props;

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
      fontWeight: concat(this._titleFontWeight, '00'),
      ...(renderTitleIcon && { 
        marginLeft: 7,
       })
    };

    const headerParams = {
      scrollY   : this._scrollY     ,
      inputRange: [0, NAVBAR_NORMAL],
    };

    return(
      <Animated.View style={[styles.headerContainer, headerContainerStyle]}>
        <VibrancyView
          style={styles.background}
          blurType={"regular"}
          intensity={0}
        />
        <AnimatedLinearGradient
          style={[styles.background, backgroundStyle]}
          colors={[ORANGE.A700, YELLOW.A700]}
          start={{x: 0, y: 1}} 
          end  ={{x: 1, y: 0}}
        />
        <Animated.View style={[styles.titleWrapper, titleWrapperStyle]}>
          <Animated.View style={[styles.titleContainer, titleContainer]}>
            <View 
              style={styles.titleIconContainer}
              onLayout={this._handleOnLayoutTitleLarge}
            >
              {renderTitleIcon && renderTitleIcon(headerParams)}
              <Animated.Text style={[styles.titleLarge, titleLarge]}>
                {this.props.titleText}
              </Animated.Text>
            </View>
          </Animated.View>
        </Animated.View>
        {this._renderSubtitle()}
      </Animated.View>
    );
  };

  _renderListHeader = () => {
    const { styles } = LargeTitleWithSnap;
    const { renderHeader } = this.props;

    return(
      <Fragment>
        <View style={[styles.listHeader, {height: NAVBAR_NORMAL}]}/>
        {renderHeader && renderHeader()}
      </Fragment>
    );
  };

  render(){
    const { styles } = LargeTitleWithSnap;
    const { children } = this.props;

    const sectionListStyle = {
      paddingBottom: 100,
      paddingTop: NAVBAR_NORMAL,
      transform : [
        {translateY: this._sectionListTransY}
      ]
    };

    let ScrollView = React.cloneElement(children, {
      style: [sectionListStyle],
      contentContainerStyle: { 
        paddingBottom: EXTRA_HEIGHT
      },
      //render + handlers
      ListHeaderComponent: this._renderListHeader     ,
      onScrollEndDrag    : this._handleOnScrollEndDrag,
      onScroll           : this._handleOnScroll       ,
      //config scrollview
      scrollEventThrottle: 1              ,
      snapToOffsets      : [NAVBAR_NORMAL],
      //adjust insets + offsets
      scrollIndicatorInsets: { top: NAVBAR_NORMAL },
      //contentInset: {top: 200}
    });

    return(
      <View style={styles.rootContainer}>
        {ScrollView}
        {this._renderHeader()}
      </View>
    );
  };
};