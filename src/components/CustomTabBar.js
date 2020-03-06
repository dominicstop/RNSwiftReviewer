import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions,  Clipboard } from 'react-native';

import Reanimated, { Easing, Value, interpolate, concat, Extrapolate} from 'react-native-reanimated';

import { BlurView, VibrancyView } from "@react-native-community/blur";
import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient';

import { GREY, ORANGE, YELLOW, INDIGO, BLUE } from 'app/src/constants/Colors';
import { TB_HEIGHT_ADJ, INSET_BOTTOM } from 'app/src/constants/UIValues';


class TabBarItem extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    background: {
      position: 'absolute',
      width: '100%',
      backgroundColor: 'rgba(0,0,0, 0.15)',
      borderRadius: 12,
      overflow: 'hidden',
    },
    backgroundIcon: {
      width: 45,
      height: 45,
      backgroundColor: 'rgba(0,0,0, 0.1)',
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    iconContainer: {
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      //glow style
      shadowColor: "white",
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
    textContainer: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    tabLabelText: {
      ...iOSUIKit.bodyEmphasizedObject,
      position: 'absolute',
      alignSelf: 'center',
      right: 0,
      width: 60,
      paddingRight: 10,
      color: 'white',
      //glow style
      shadowColor: "white",
      shadowOpacity: 0.25,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
  });

  constructor(props){
    super(props);

    this._progress = new Value(
      props.isInitialRoute? 100 : 0
    );

    this._bgOpacity = interpolate(this._progress, {
      inputRange : [25, 100],
      outputRange: [0 , 1  ],
      extrapolate: Extrapolate.CLAMP,
    });

    this._bgScaleX = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.5, 1  ],
      extrapolate: Extrapolate.CLAMP,
    });

    this._iconOpacity = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0.6, 1  ],
      extrapolate: Extrapolate.CLAMP,
    });

    this._iconScale = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [1.05, 0.85],
      extrapolate: Extrapolate.CLAMP,
    });

    this._textWidth = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0, 60 ],
      extrapolate: Extrapolate.CLAMP,
    });

    this._textOpacity = interpolate(this._progress, {
      inputRange : [75, 100],
      outputRange: [0 , 1  ],
      extrapolate: Extrapolate.CLAMP,
    });
  };

  setIsExpanded = (isExpanded) => {
    const animation = Reanimated.timing(this._progress, {
      duration: 250,
      toValue : (isExpanded? 100 : 0),
      easing  : Easing.inOut(Easing.ease)
    });

    animation.start();
  };

  _handleOnPressTab = () => {
    const { route, routeIndex, onPressTab } = this.props;
    onPressTab && onPressTab(route, routeIndex);
  };

  render(){
    const { styles } = TabBarItem;
    const { tabIcon, labelText } = this.props;

    const bgStyle = {
      opacity: this._bgOpacity,
      transform: [
        { scaleX: this._bgScaleX }
      ],
    };

    const iconStyle = {
      opacity: this._iconOpacity,
      transform: [
        { scale: this._iconScale }
      ],
    };

    const textStyle = {
      width  : this._textWidth  ,
      opacity: this._textOpacity,
    };

    return(
      <TouchableOpacity
        style={styles.rootContainer}
        activeOpacity={0.75}
        onPress={this._handleOnPressTab}
      >
        <Reanimated.View style={[styles.background, bgStyle]}>
          <View style={styles.backgroundIcon}/>
        </Reanimated.View>
        <Reanimated.View style={[styles.iconContainer, iconStyle]}>
          {tabIcon}
        </Reanimated.View>
        <Reanimated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.tabLabelText}>
            {labelText}
          </Text>
        </Reanimated.View>
      </TouchableOpacity>
    );
  };
};

export class CustomTabBar extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      //float bottom
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      //layout
      width: '100%',
      height: TB_HEIGHT_ADJ,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingBottom: INSET_BOTTOM,
      //shadow
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 7,
      shadowOffset: {
        width: 0,
        height: -5,
      },
    },
    blurBackground: {
      ...StyleSheet.absoluteFillObject,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.8,
    }
  });

  constructor(props){
    super(props);

    const { navigation } = props;
    const { routes, index: activeRouteIndex } = navigation.state;

    this._prevRoute = {
      route     : routes[activeRouteIndex],
      routeIndex: activeRouteIndex,
    };
  };

  _handleOnPressTab = (route, routeIndex) => {
    const { onTabPress } = this.props;

    const prevRouteIndex = this._prevRoute.routeIndex;
    if(prevRouteIndex == routeIndex) return;

    const prevTabRef = this[`tabBarItem-${prevRouteIndex}`];
    const currTabRef = this[`tabBarItem-${routeIndex    }`];

    prevTabRef.setIsExpanded(false);
    currTabRef.setIsExpanded(true );

    this._prevRoute = {
      route, routeIndex
    };

    onTabPress && onTabPress({ route });
    this.rootContainer.pulse(500);
  };

  _renderTabs = (route, routeIndex) => {
    const { navigation, ...props } = this.props;
    const { index: activeRouteIndex } = navigation.state;

    const isInitialRoute = (routeIndex === activeRouteIndex);

    const labelText = props.getLabelText({route});
    const tabIcon   = props.renderIcon  ({route, 
      tintColor: 'red',
      focused: isInitialRoute,  
    });

    return(
      <TabBarItem
        ref={r => this[`tabBarItem-${routeIndex}`] = r}
        onPressTab={this._handleOnPressTab}
        {...{route, routeIndex, isInitialRoute, labelText, tabIcon}}
      />
    );
  };

  render(){
    const { styles } = CustomTabBar;
    const { navigation } = this.props;

    const { routes, index: activeRouteIndex } = navigation.state;

    return(
      <Animatable.View
        style={styles.rootContainer}
        ref={r => this.rootContainer = r}
        useNativeDriver={true}
      >
        <VibrancyView
          style={styles.blurBackground}
          blurType={"light"}
          intensity={100}
        />
        <LinearGradient
          style={[styles.background]}
          colors={[INDIGO.A700, BLUE.A700]}
          start={{x: 0, y: 1}} 
          end  ={{x: 1, y: 0}}
        />
        {routes.map(this._renderTabs)}
      </Animatable.View>
    );
  };
};