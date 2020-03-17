import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import * as Colors from 'app/src/constants/Colors';

import Reanimated, { Easing }  from 'react-native-reanimated';
const { Value, interpolate, timing, concat, floor, Extrapolate } = Reanimated; 

const MODES = {
  'INITIAL': 'INITIAL',
  'FOCUSED': 'FOCUSED',
  'BLURRED': 'BLURRED',
  'INVALID': 'INVALID',
};

function deriveStateFromMode(mode){
  switch (mode) {
    case MODES.INITIAL:
    case MODES.BLURRED: return {
      colorBorder     : Colors.BLUE[800],
      colorInput      : Colors.GREY[600],
      colorSubtitle   : Colors.GREY[900],
      colorPlaceholder: Colors.GREY[600],
      colorItemBadge  : Colors.INDIGO['A400'],
      fontWeightInput : '400',
    };
    case MODES.FOCUSED: return {
      colorBorder     : Colors.BLUE['A700'],
      colorInput      : Colors.BLUE[900],
      colorSubtitle   : Colors.GREY[900],
      colorPlaceholder: Colors.GREY[700],
      colorItemBadge  : Colors.INDIGO['A700'],
      fontWeightInput : '600',
    };
    case MODES.INVALID: return {
      colorBorder     : Colors.RED['A700'],
      colorInput      : Colors.RED[700],
      colorSubtitle   : Colors.RED[700],
      colorPlaceholder: Colors.RED[400],
      colorItemBadge  : Colors.RED['A700'],
      fontWeightInput : '400',
    };
  };
};

export class ModalInputMultiline extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
    },
    subtitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    inputBackgound: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    inputBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 10,
      borderColor: Colors.BLUE.A700,
    },
    textSubtitle: {
      ...iOSUIKit.subheadObject,
      marginLeft: 5,
    },
    textInput: {
      marginTop: 5,
      marginBottom: 10,
      marginHorizontal: 15,
      ...iOSUIKit.subheadObject,
    },
  });

  constructor(props){
    super(props);

    this.state = {
      mode     : MODES.INITIAL,
      textInput: props.initialValue ?? '',
    };

    this._progress = new Value(0);

    this._bgOpacity = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.5, 1],
    });

    this._borderOpacity = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.4, 0.5],
    });

    this._borderWidth = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [2, 3  ],
    });

    this._subtitleScale = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [1, 1.05],
    });

    this._subtitleTransX = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0, 10],
    });

    this._subtitleTransY = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0, -0.5],
    });

    this._subtitleOpacity = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.7, 1],
    });
  };

  _handleOnTextFocus = () => {
    this.setState({mode: MODES.FOCUSED});
    const animation = timing(this._progress, {
      duration: 300,
      toValue : 100,
      easing  : Easing.inOut(Easing.ease)
    });

    animation.start();
    this.inputContainerRef.pulse(500);
  };

  _handleOnTextBlur = () => {
    const { onBlur, validate } = this.props;
    const { textInput } = this.state;

    const isValid = validate && validate(textInput);

    const animation = timing(this._progress, {
      easing  : Easing.inOut(Easing.ease),
      toValue : 0,
      duration: 300,
    });

    animation.start();

    const mode = (isValid
      ? MODES.BLURRED
      : MODES.INVALID
    );

    onBlur && onBlur({textInput, mode});
    this.setState({mode});
  };

  _handleOnChangeText = (input) => {
    this.setState({textInput: input});
  };

  render(){
    const { styles } = ModalInputMultiline;
    const { mode } = this.state;
    const props = this.props;
    
    const values = deriveStateFromMode(mode);

    const inputBackgoundStyle = {
      opacity: this._bgOpacity,
    };

    const inputBorder = {
      opacity    : this._borderOpacity,
      borderWidth: this._borderWidth  ,
      borderColor: values.colorBorder ,
    };

    const textInputStyle = {
      color: values.colorInput,
      fontWeight: values.fontWeightInput
    };

    const subtitleContainerStyle = {
      transform: [
        { scale     : this._subtitleScale  },
        { translateX: this._subtitleTransX },
        { translateY: this._subtitleTransY },
      ],
    };

    const textSubtitleStyle = {
      color  : values.colorSubtitle,
      opacity: this._subtitleOpacity,
    };

    return(
      <View style={styles.rootContainer}>
        <Reanimated.View style={[styles.subtitleContainer, subtitleContainerStyle]}>
          <ListItemBadge
            value={props.index + 1}
            size={15}
            initFontSize={12}
            color={values.colorItemBadge}
          />
          <Reanimated.Text style={[styles.textSubtitle, textSubtitleStyle]}>
            {props.subtitle}
          </Reanimated.Text>
        </Reanimated.View>
        <Animatable.View 
          style={styles.inputContainer}
          ref={r => this.inputContainerRef = r}
          useNativeDriver={true}
        >
          <Reanimated.View style={[styles.inputBackgound, inputBackgoundStyle]}/>
          <Reanimated.View style={[styles.inputBorder, inputBorder]}/>
          <TextInput
            style={[styles.textInput, textInputStyle]}
            onFocus={this._handleOnTextFocus}
            onBlur={this._handleOnTextBlur}
            onChangeText={this._handleOnChangeText}
            placeholder={props.placeholder}
            placeholderTextColor={values.colorPlaceholder}
            returnKeyType={'default'}
            multiline={true}
            blurOnSubmit={false}
            {...props}
          />
        </Animatable.View>
      </View>
    );
  };
};