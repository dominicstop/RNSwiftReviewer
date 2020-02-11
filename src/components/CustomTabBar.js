import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,  Clipboard } from 'react-native';

import Reanimated, { Easing, Value, interpolate} from 'react-native-reanimated';

import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import * as Animatable from 'react-native-animatable';

import { timeout } from 'app/src/functions/helpers';

const tabBarMargin = 20;
const bottomInset = StaticSafeAreaInsets.safeAreaInsetsBottom;
const bottomMargin = (bottomInset == 0)? tabBarMargin : bottomInset;

/** store/record ui values */
let TBValues = {};
const TBKeys = {
  x     : 'x'     ,
  y     : 'y'     ,
  width : 'width' ,
  height: 'height',
};


export class CustomTabBar extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      //float
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      //tab bar style
      marginBottom: bottomMargin,
      marginHorizontal: tabBarMargin,
      borderRadius: bottomMargin,
      backgroundColor: 'transparent',
      //shadow
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    blurContainer: {
      flexDirection: 'row',
      borderRadius: bottomMargin,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabIcon: {
      //dummy
      width: 30,
      height: 30,
      backgroundColor: 'red',
      marginBottom: 5,
    },
    tabIndicatorContainer: {
      //float
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    indicatorStyle: {
      backgroundColor: 'rgba(127,127,127,0.25)',
    },
    tabBarSeperatorContainer: {
      //float
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      //layout
      flexDirection: 'row',
    },
    tabBarSeperator: {
      flex: 1,
      borderColor: 'rgba(0,0,0,0.1)',
      marginVertical: 15,
    },
  });

  constructor(props){
    super(props);

    this.state = {
      showIndicator: false,
    };

    this._currentIndex = new Value(0);
  };

  componentWillUnmount(){
    TBValues = {};
  };

  initIndicator = () => {
    const { navigation } = this.props;
    const { routes, index: activeRouteIndex } = navigation.state;

    const routeCount  = routes.length;
    const activeRoute = routes[activeRouteIndex];

    // range from 0 to routeCount
    const inputRange = [...Array(routeCount).keys()];

    this._indicatorX = interpolate(this._currentIndex, {
      inputRange,
      outputRange: inputRange.map((index) => {
        const { key } = routes[index];
        return TBValues[key][TBKeys.x];
      }),
    });

    this._indicatorY = interpolate(this._currentIndex, {
      inputRange,
      outputRange: inputRange.map((index) => {
        const { key } = routes[index];
        return TBValues[key][TBKeys.y];
      }),
    });

    this._indicatorH = interpolate(this._currentIndex, {
      inputRange,
      outputRange: inputRange.map((index) => {
        const { key } = routes[index];
        return TBValues[key][TBKeys.height];
      }),
    });

    this._indicatorW = interpolate(this._currentIndex, {
      inputRange,
      outputRange: inputRange.map((index) => {
        const { key } = routes[index];
        return TBValues[key][TBKeys.width];
      }),
    });

    this.setState({showIndicator: true});
  };

  _handleOnPressTab = (route, routeIndex) => {
    const props = this.props;

    const animation = Reanimated.timing(this._currentIndex, {
      duration: 250,
      toValue: routeIndex,
      easing: Easing.inOut(Easing.ease),
    });

    props.onTabPress({ route });
    animation.start();
    this.rootContainer.pulse(300);
  };

  _renderBG(){
    const { styles } = CustomTabBar;
    const { showIndicator } = this.state;

    if(!showIndicator) return null;

    const indicatorStyle = {
      width : this._indicatorW, 
      height: this._indicatorH, 
      transform: [
        { translateX: this._indicatorX },
        { translateY: this._indicatorY },
      ],
    };
    
    return(
      <View style={styles.tabIndicatorContainer}>
        <Reanimated.View
          style={[indicatorStyle, styles.indicatorStyle]}
        />
      </View>
    );
  };

  _renderSeperators(){
    const { styles } = CustomTabBar;
    const { navigation } = this.props;
    const { routes } = navigation.state;

    const routeCount = routes.length;

    return(
      <View style={styles.tabBarSeperatorContainer}>
        {routes.map((route, routeIndex) => {
          const seperatorStyle = {
            //is not last tab style
            ...((routeIndex < (routeCount - 1)) && {
              borderRightWidth: 2,
            }),
          };

          return(
            <View style={[styles.tabBarSeperator, seperatorStyle]}/>
          );
        })}
      </View>
    );
  };

  _renderTabs = (route, routeIndex) => {
    const { styles } = CustomTabBar;
    const { navigation, ...props } = this.props;
    const { routes, index: activeRouteIndex } = navigation.state;

    const routeKey      = route.key;
    const routeCount    = routes.length;
    const isRouteActive = (routeIndex === activeRouteIndex);

    const labelText = props.getLabelText({ route });
    const tabIcon   = props.renderIcon({ 
      route, 
      tintColor: 'red',
      focused: isRouteActive,  
    }); 

    const wasMeasured = (TBValues[routeKey] !== undefined);
    const onLayoutHandlerName = `handleOnLayout-${routeKey}`;

    //create onLayout handler for this tab
    this[onLayoutHandlerName] = ({nativeEvent}) => {
      //pass down { x, y, width, height } to TBValues
      TBValues[routeKey] = { ...nativeEvent.layout };
      //remove handler
      this[onLayoutHandlerName] = undefined;

      //show indicator
      const count = Object.keys(TBValues).length;
      if(count == routeCount){
        this.initIndicator();
      };
    };

    return(
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.75}
        onPress={() => this._handleOnPressTab(route, routeIndex)}
        onLayout={this[onLayoutHandlerName]}
        {...(!wasMeasured && { onLayout: this[onLayoutHandlerName]})}
      >
        {tabIcon}
        <Text>{labelText}</Text>
      </TouchableOpacity>
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
        <BlurView
          style={styles.blurContainer}
          blurType={"regular"}
          blurAmount={100}
        >
          {this._renderBG()}
          {this._renderSeperators()}
          {routes.map(this._renderTabs)}
        </BlurView>
      </Animatable.View>
    );
  };
};