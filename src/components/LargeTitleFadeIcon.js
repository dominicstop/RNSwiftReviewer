import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from "react-native-reanimated";

export class LargeTitleFadeIcon extends React.Component {
  static propTypes = {
    scrollY   : PropTypes.object,
    inputRange: PropTypes.object,
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
    });

    this.iconOpacityB = Reanimated.interpolate(props.scrollY, {
      inputRange : props.inputRange,
      outputRange: [0, 1],
    });
  };

  render(){
    const { styles } = LargeTitleFadeIcon;
    const { children: _children, style } = this.props;

    const children = React.Children.toArray(_children);

    const iconStyleA = {
      opacity: this.iconOpacityA,
    };

    const iconStyleB = {
      opacity: this.iconOpacityB,
    };

    return(
      <View {...{style}}>
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