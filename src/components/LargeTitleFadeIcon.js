import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated, { Extrapolate } from "react-native-reanimated";

export class LargeTitleFadeIcon extends React.Component {
  static propTypes = {
    scrollY   : PropTypes.object,
    inputRange: PropTypes.array ,
  };

  static styles = StyleSheet.create({
    iconBContainer: {
      position: 'absolute',
    },
  });

  constructor(props){
    super(props);

    this.iconOpacityA = Reanimated.interpolate(props.scrollY, {
      inputRange : props.inputRange,
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.iconOpacityB = Reanimated.interpolate(props.scrollY, {
      inputRange : props.inputRange,
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
  };

  render(){
    const { styles } = LargeTitleFadeIcon;
    const { children: _children, ...props } = this.props;

    const children = React.Children.toArray(_children);

    const iconStyleA = {
      opacity: this.iconOpacityA,
    };

    const iconStyleB = {
      opacity: this.iconOpacityB,
    };

    return(
      <View {...props}>
        <Reanimated.View style={[styles.iconBContainer, iconStyleB]}>
          {children[1]}
        </Reanimated.View>
        <Reanimated.View style={iconStyleA}>
          {children[0]}
        </Reanimated.View>
      </View>
    );
  };
};