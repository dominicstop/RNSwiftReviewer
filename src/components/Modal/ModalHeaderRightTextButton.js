import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import * as Colors from 'app/src/constants/Colors';


export class ModalHeaderRightTextButton extends React.PureComponent {
  constructor(props){
    super(props);

    this.state = {
      mount: props.visible
    };
  };

  async componentDidUpdate(prevProps, prevState){
    const { visible: nextVisible } = this.props;
    const prevVisible = prevProps.visible;

    const didChange = (prevVisible != nextVisible);
    if(didChange && nextVisible){
      this.setState({ mount: true });

    }else if (didChange && !nextVisible) {
      await this.animatedRef.fadeOutRight(300);
      this.setState({ mount: false });
    };
  };

  _handleOnPress = async () => {
    await this.animatedRef.pulse(250);
    this.props.onPress?.();
  };

  render(){
    const props = this.props;
    if(!this.state.mount) return null;

    return(
      <Animatable.View
        ref={r => this.animatedRef = r}
        animation={'fadeInRight'}
        easing={'ease-in-out'}
        duration={500}
        delay={props.delay ?? 300}
        useNativeDriver={true}
      >
        <TouchableOpacity 
          style={styles.rootContainer}
          onPress={this._handleOnPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {props.text ?? "Button"}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    shadowColor: 'rgba(255,255,255,0.5)',
    shadowRadius: 7,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: Colors.BLUE.A700,
    fontWeight: '700',
  },
});