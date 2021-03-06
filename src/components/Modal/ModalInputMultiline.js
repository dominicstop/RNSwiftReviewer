import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

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
    case MODES.BLURRED:
    case MODES.INITIAL: return {
      colorBorder     : Colors.BLUE[800],
      colorInput      : Helpers.hexToRGBA(Colors.BLUE[1000], 0.8),
      colorSubtitle   : Colors.GREY[900],
      colorPlaceholder: Helpers.hexToRGBA(Colors.BLUE[1000], 0.5),
      colorItemBadge  : Colors.INDIGO['A400'],
      colorBackground : Helpers.hexToRGBA(Colors.BLUE[50], 0.25),
      fontWeightInput : '600',
    };
    case MODES.FOCUSED: return {
      colorBorder     : Colors.BLUE['A700'],
      colorInput      : Colors.BLUE[1000],
      colorSubtitle   : Colors.GREY[800],
      colorPlaceholder: Helpers.hexToRGBA(Colors.BLUE[900], 0.6),
      colorItemBadge  : Colors.INDIGO['A700'],
      colorBackground : 'white',
      fontWeightInput : '700',
    };
    case MODES.INVALID: return {
      colorBorder     : Colors.RED['A700'],
      colorInput      : Colors.RED[700],
      colorSubtitle   : Colors.RED[900],
      colorPlaceholder: Helpers.hexToRGBA(Colors.RED[900], 0.6),
      colorItemBadge  : Colors.RED['A700'],
      colorBackground : Helpers.hexToRGBA(Colors.RED[50], 0.5),
      fontWeightInput : '600',
    };
  };
};

export class ModalInputMultiline extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
    },
    subtitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 7,
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
      mode: MODES.INITIAL,
    };

    this._textInput = props.initialValue ?? '';
    this._progress  = new Value(0);

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

  isValid = (animate) => {
    const isValid = 
      this.props.validate?.(this._textInput);

    if(!isValid && animate){
      this.inputContainerRef.shake(750);
      this.setState({
        mode: MODES.INVALID
      });
    };

    return isValid;
  };

  getTextValue = () => {
    return this._textInput;
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
    const isValid = 
      this.props.validate?.(this._textInput);

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

    this.setState({mode});
    this.props.onBlur?.({
      mode, textInput: this._textInput 
    });
  };

  _handleOnChangeText = (input) => {
    this._textInput = input;
    this.props.onChangeValue?.(input);
  };

  render(){
    const { styles } = ModalInputMultiline;
    const { mode } = this.state;
    const props = this.props;
    
    const values = deriveStateFromMode(mode);
    const inputBackgoundStyle = {
      opacity: this._bgOpacity,
      backgroundColor: values.colorBackground,
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
            size={16}
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