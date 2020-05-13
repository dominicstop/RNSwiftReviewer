import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';
import * as Animatable from 'react-native-animatable';


export class Pressable extends React.PureComponent {
  static propTypes = {
    onPress      : PropTypes.func,
    debounce     : PropTypes.bool,
    activeOpacity: PropTypes.number,
  };

  static defaultProps = {
    debounce: true,
    activeOpacity: 0.75,
  };

  constructor(props){
    super(props);

    if(props.debounce){
      this._handleOnPress = 
        debounce(this._handleOnPress, 750, {leading: true});
    };
  };

  _handleOnPress = () => {
    const { onPress } = this.props;

    onPress && onPress();
    this.wrapperRef.pulse(300);
  };

  render(){
    const props = this.props;

    return(
      <Animatable.View
        ref={r => this.wrapperRef = r}
        style={props.wrapperStyle}
        useNativeDriver={true}
      >
        <TouchableOpacity
          style={props.containerStyle}
          activeOpacity={props.activeOpacity}
          onPress={this._handleOnPress}
        >
          {props.children}
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};