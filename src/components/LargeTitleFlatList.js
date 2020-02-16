import React, { Fragment } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, SectionList } from 'react-native';
import PropTypes from 'prop-types';

import { HeaderValues } from 'app/src/constants/HeaderValues';
import { GREY, ORANGE, YELLOW, INDIGO, BLUE } from 'app/src/constants/Colors';

import { BlurView, VibrancyView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import Animated, { Easing } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
const { concat, floor, Extrapolate, interpolate, Value, event, block, set, divide, add, debug } = Animated;

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
    headerContentContainer: {
      flex: 1,
      flexDirection: 'row', 
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
      bottom: 5,
    },
    titleIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
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
      color: 'white',
    },
    subtitleText: {
      fontSize: 20,
      fontWeight: '400',
      color: 'white',

    },
    listHeader: {
      width: '100%', 
    },
  });

  constructor(props){
    super(props);

    this.state = {
      enableSnap: false,
    };

    const subtitleHeight = (props.showSubtitle? props.subtitleHeight : 0);
    const NAVBAR_FHEIGHT = (NAVBAR_LARGE + subtitleHeight);

    this._titleLargeWidth  = new Value(-1);
    this._titleLargeHeight = new Value(-1);
    this._scrollY          = new Value(0 );

    this._handleOnScroll = event([{ 
      nativeEvent: ({contentOffset: {y}}) => block([
        set(this._scrollY, y),
        //sdebug('scrollY: ', this._scrollY),
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

  componentDidMount = () => {
    this.setState({enableSnap: true});
  };

  _handleOnLayoutTitleLarge = ({nativeEvent}) => {
    if(!this._isTitleLargeMeasured){
      const { x, y, width, height } = nativeEvent.layout;

      this._titleLargeHeight.setValue(height);
      this._titleLargeWidth.setValue(width + (width / 6.15) + 10);
      //this._scrollY.setValue(0);

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
          colors={[INDIGO[700], BLUE[500]]}
          start={{x: 0, y: 1}} 
          end  ={{x: 1, y: 0}}
        />
        <View style={styles.headerContentContainer}>
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
        </View>
      </Animated.View>
    );
  };

  _renderListHeader = () => {
    const { styles } = LargeTitleWithSnap;
    const { renderHeader } = this.props;

    return(
      <View style={[styles.listHeader, {marginTop: NAVBAR_NORMAL}]}>
        {renderHeader && renderHeader()}
      </View>
    );
  };

  render(){
    const { styles } = LargeTitleWithSnap;
    const { children } = this.props;
    const { enableSnap } = this.state;

    const sectionListStyle = {
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
      scrollEventThrottle          : 1   ,
      disableScrollViewPanResponder: true,
      //snaping behaviour
      snapToOffsets: (enableSnap? [0, NAVBAR_NORMAL] : null),
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