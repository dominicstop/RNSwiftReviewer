import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import * as Helpers from 'app/src/functions/helpers';
import { TB_HEIGHT_ADJ, INSET_TOP, INSET_BOTTOM } from 'app/src/constants/UIValues';
import { HeaderValues } from 'app/src/constants/HeaderValues';
import { INDIGO, BLUE } from 'app/src/constants/Colors';

import { ListFooterIcon    } from 'app/src/components/ListFooterIcon';
import { REALinearGradient } from 'app/src/components/ReanimatedComps';

import { VibrancyView } from "@react-native-community/blur";
import { Transitioning, Transition, Easing } from 'react-native-reanimated';

import Animated from 'react-native-reanimated';

const { concat, floor, Extrapolate, interpolate, Value, event, block, set, divide, add, sub, debug } = Animated;
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');


const NAVBAR_NORMAL = HeaderValues.getHeaderHeight     (false);
const NAVBAR_LARGE  = HeaderValues.getHeaderHeightLarge(false);
const BOTTOM_SPACE = (TB_HEIGHT_ADJ + NAVBAR_NORMAL + 50);
const DEBUG_COLORS  = false;
const EXTRA_HEIGHT  = 30;

const transition = (
  <Transition.Sequence>
    <Transition.Out
      durationMs={300} 
      type="fade"
    />
    <Transition.Change interpolation="easeInOut" />
    <Transition.In
      durationMs={300} 
      type="fade"
    />
  </Transition.Sequence>
);


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
    subtitleHeight: 35,
    titleText: 'Large Title',
    extraHeight: 0,
    headerHeight: 300,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      height: screenHeight + EXTRA_HEIGHT,
    },
    scrollView: {
      flex: 1,
    },
    headerWrapper: {
      position: "absolute",
      width: '100%',
    },
    headerContainer: {
      position: "absolute",
      width: '100%',
      overflow: 'hidden',
      marginTop: INSET_TOP,
    },
    headerBGContainer: {
      ...StyleSheet.absoluteFillObject,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    subtitleContainer: {
      position: 'absolute',
      width: '100%',
      marginLeft: 10,
      bottom: 0,
      ...(DEBUG_COLORS && 
        { backgroundColor: 'green' }
      ),
    },
    titleIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    //controls horizontal alignment
    titleWrapper: {
      position: "absolute",
      alignItems: 'center',
      justifyContent: 'flex-end',
      ...(DEBUG_COLORS && 
        { backgroundColor: 'blue' }
      ),
    },
    //controls vertical alignment
    titleContainer: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginLeft: 10,
      ...(DEBUG_COLORS && 
        { backgroundColor: 'orange' }
      ),
    },
    titleLarge: {
      fontSize: 34,
      fontWeight: '900',
      color: 'white',
      ...(DEBUG_COLORS && 
        { backgroundColor: 'yellow' }
      ),
      //glow
      shadowColor: "white",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },
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
      enableSnap       : false,
      neededHeight: 0    ,
    };

    this._headerListHeight   = 0;
    const subtitleHeight = (props.showSubtitle? props.subtitleHeight : 0);

    this._titleLargeWidth  = new Value(-1);
    this._titleLargeHeight = new Value(-1);
    this._scrollY          = new Value(0 );

    this._handleOnScroll = event([{ 
      nativeEvent: ({contentOffset: {y}}) => block([
        set(this._scrollY, y),
        //sdebug('scrollY: ', this._scrollY),
      ])
    }]);

    this._progress = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });

    this._headerScale = interpolate(this._scrollY, {
      inputRange : [-200, 0],
      outputRange: [1.2, 1],
      extrapolate: Extrapolate.CLAMP,
    });

    this._headerTransX = interpolate(this._scrollY, {
      inputRange : [-200, 0],
      outputRange: [30, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this._headerTransY = interpolate(this._scrollY, {
      inputRange : [-200, 0],
      outputRange: [0, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this._headerHeight = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [NAVBAR_LARGE, NAVBAR_NORMAL],
      extrapolate: Extrapolate.CLAMP,
    });

    const diff   = (NAVBAR_LARGE - NAVBAR_NORMAL);
    const offset = (diff - NAVBAR_NORMAL);

    this._sectionListTransY = interpolate(this._progress, {
      inputRange : [0, 100],
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
      extrapolateLeft : Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.CLAMP,
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
      outputRange: [this._titleLargeHeight, NAVBAR_ADJ],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleTransScale = interpolate(this._scrollY, {
      inputRange : [0, NAVBAR_NORMAL],
      outputRange: [1, 0.55],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleFontWeight = floor(
      interpolate(this._scrollY, {
        inputRange : [0, (NAVBAR_NORMAL/4), NAVBAR_NORMAL],
        outputRange: [8, 8, 5],
        extrapolate: Extrapolate.CLAMP,
      })
    );

    // shared animated values
    this.sharedAnimatedValues = {
      scrollY   : this._scrollY     ,
      inputRange: [0, NAVBAR_NORMAL],
    };
  };

  componentDidMount = async () => {
    this.setState({enableSnap: true});

    await Helpers.timeout(250);

    const node = this.sectionListRef.getNode();
    node && node.scrollToLocation({
      itemIndex: 0,
      sectionIndex: 0,
      viewOffset: 1000,
      viewPosition: 0,
      animated: false,
    });

    this.footerRef.measureInWindow((x, y) => {
      const neededHeight = (screenHeight - y);

      this.setState({
        neededHeight: ((neededHeight < 0)? 0 : neededHeight)
      });
    });
  };

  getTransitionRef = () => {
    return this.transitionRef;
  };

  _handleOnLayoutFooter = ({nativeEvent: { layout }}) => {
    const { neededHeight } = this.state;
    console.log(`screenHeight: ${screenHeight}`);
    console.log(`footer height: ${layout.height}`);
    console.log(`needed space: ${screenHeight - layout.height}\n\n`);

    if(neededHeight == 0){
      this.setState({
        neededHeight: layout.height,
      });
    };
  };

  _handleOnLayoutTitleLarge = ({nativeEvent}) => {
    if(!this._isTitleLargeMeasured){
      const { x, y, width, height } = nativeEvent.layout;

      this._titleLargeHeight.setValue(height);
      this._titleLargeWidth.setValue(width + (width / 6.15) + 10);
      this._scrollY.setValue(0);

      this._isTitleLargeMeasured = true;
    };
  };

  _handleOnEndReached = () => {
    this.listFooterIconRef.show(true);
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

    const headerWrapperStyle = {
      transform: [
        { scale     : this._headerScale  },
        { translateX: this._headerTransX },
        { translateY: this._headerTransY },
      ],
    };

    const headerBGContainerStyle = {
      height: add(this._headerHeight, INSET_TOP),
    };

    const headerContainerStyle = {
      height: this._headerHeight,
    };

    const backgroundStyle = {
      opacity: this._bGOpacity
    };

    //controls horizontal alignment
    const titleWrapperStyle = {
      height       : this._headerHeight,
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

    return(
      <Animated.View style={[styles.headerWrapper, headerWrapperStyle]}>
        <Animated.View style={[styles.headerBGContainer, headerBGContainerStyle]}>
          <VibrancyView
            style={styles.background}
            blurType={"light"}
            intensity={100}
          />
          <REALinearGradient
            style={[styles.background, backgroundStyle]}
            colors={[INDIGO.A700, BLUE.A700]}
            start={{x: 0, y: 1}} 
            end  ={{x: 1, y: 0}}
          />
        </Animated.View>
        <Animated.View style={[styles.headerContainer, headerContainerStyle]}>
          <Animated.View style={[styles.titleWrapper, titleWrapperStyle]}>
            <Animated.View style={[styles.titleContainer, titleContainer]}>
              <View 
                style={styles.titleIconContainer}
                onLayout={this._handleOnLayoutTitleLarge}
              >
                {renderTitleIcon && renderTitleIcon(this.sharedAnimatedValues)}
                <Animated.Text style={[styles.titleLarge, titleLarge]}>
                  {this.props.titleText}
                </Animated.Text>
              </View>
            </Animated.View>
          </Animated.View>
          {this._renderSubtitle()}
        </Animated.View>
      </Animated.View>
    );
  };

  _renderListHeader = () => {
    const { styles } = LargeTitleWithSnap;
    const { renderHeader } = this.props;

    return(
      <View style={[styles.listHeader, {marginTop: NAVBAR_NORMAL}]}>
        {renderHeader && renderHeader(this.sharedAnimatedValues)}
      </View>
    );
  };

  _renderListFooter = () => {
    const { renderFooter, itemCount } = this.props;
    const { neededHeight } = this.state;

    return(
      <Fragment>
        {renderFooter && renderFooter()}
        <ListFooterIcon
          ref={r => this.listFooterIconRef = r}
          hasEntranceAnimation={(itemCount > 0)}
        />
        {(neededHeight == 0) && (
          <View
            ref={r => this.footerRef = r}
            style={{width: '100%', height: 1}}
          />
        )}
      </Fragment>
    );
  };

  render(){
    const { styles } = LargeTitleWithSnap;
    const { itemCount, itemSize, ...props } = this.props;
    const { enableSnap, neededHeight } = this.state;

    const extraHeight = (
       neededHeight + EXTRA_HEIGHT + NAVBAR_NORMAL + TB_HEIGHT_ADJ + 50
    );

    const sectionListStyle = {
      paddingTop: NAVBAR_NORMAL + INSET_TOP,
      transform : [
        { translateY: this._sectionListTransY }
      ]
    };

    //get sectionList child
    const children    = React.Children.toArray(props.children);
    const sectionList = children[0];

    //pass props to sectionList child comp
    let SectionList = React.cloneElement(sectionList, {
      style: [styles.scrollView, sectionListStyle],
      contentContainerStyle: { 
        paddingBottom: (extraHeight + props.extraHeight),
      },
      //render + handlers
      ListHeaderComponent: this._renderListHeader        ,
      ListFooterComponent: this._renderListFooter        ,
      onScrollEndDrag    : this._handleOnScrollEndDrag   ,
      onScroll           : this._handleOnScroll          ,
      onEndReached       : this._handleOnEndReached      ,
      //config scrollview
      scrollEventThrottle: 1,
      disableScrollViewPanResponder: true,
      //snaping behaviour
      snapToOffsets: (enableSnap? [0, NAVBAR_NORMAL] : null),
      snapToEnd: false,
      snapToAlignment: 'center',
      snapToStart: true,
      scrollsToTop: false,
      //adjust insets + offsets
      scrollIndicatorInsets: {
        top   : NAVBAR_LARGE + 10,
        bottom: TB_HEIGHT_ADJ + EXTRA_HEIGHT,
      },
      //get and store ref to this comp
      ref: (node) => {
        const { ref } = sectionList;
        this.sectionListRef = node;
        ref && ref(node);
      },
    });

    return(
      <View style={styles.rootContainer}>
        <Transitioning.View
          style={{flex: 1}}
          ref={r => this.transitionRef = r}
          {...{transition}}
        >
          {SectionList}
        </Transitioning.View>
        {this._renderHeader()}
      </View>
    );
  };
};