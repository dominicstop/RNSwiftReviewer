import React, { Fragment } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';


//wrapper: used for animating items inside a flatlist
export class AnimatedListItem extends React.PureComponent {
  static propTypes = {
    index     : PropTypes.number,
    delay     : PropTypes.number,
    multiplier: PropTypes.number,
    last      : PropTypes.number,
  };

  static defaultProps = {
    index     : 0  ,
    delay     : 0  ,
    multiplier: 100,
    last      : 3  ,
  };

  render(){
    const { index, last, duration, delay, multiplier, children, ...props } = this.props;
    const offset = (index * (multiplier/2));

    return ((index < last)? (
      <Animatable.View
        ref={props.innerRef}
        duration={(duration + offset)}
        delay={(delay + offset)}
        animation={'fadeInUp'}
        easing={'ease-in-out'}
        useNativeDriver={true}
        collapsable={true}
        {...props}
      >
        {children}
      </Animatable.View>
    ) : (
      children
    ));
  };
}