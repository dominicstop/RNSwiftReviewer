import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import { BLUE, GREY, RED, INDIGO } from '../constants/Colors';

import Reanimated, { Easing }  from 'react-native-reanimated';
const { Value, interpolate, timing, concat, floor, Extrapolate } = Reanimated; 

const MODES = {
  'FOCUSED': 'FOCUSED',
  'BLURRED': 'BLURRED',
  'INVALID': 'INVALID',
};

export class ModalInputField extends React.Component {
  static propTypes = {
    title      : PropTypes.string,
    subtitle   : PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    title      : 'Title N/A',
    subtitle   : 'Subtitle N/A',
    placeholder: 'Input Text',
  };

  static styles = StyleSheet.create({
    inputContainer: {
      overflow: 'hidden',
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: 5,
    },
    inputBackgound: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    inputBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 10,
      borderColor: BLUE.A700,
    },
    iconWrapper: {
      height: 40,
      width: 40,
    },
    iconContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
      ...iOSUIKit.bodyObject,
      flex: 1,
      alignSelf: 'stretch',
      marginHorizontal: 10,
      marginLeft: 0,
      marginRight: 10,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textTitle: {
      ...iOSUIKit.title3Object,
      marginLeft: 7,
    },
    textSubtitle: {
      ...iOSUIKit.subheadObject,
      marginBottom: 2,
    },
  });

  constructor(props){
    super(props);

    this.state = {
      mode: MODES.BLURRED,
      textInput: '',
    };

    this._progress = new Value(0);

    this._bgOpacity = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.5, 1],
    });

    this._iconOpacityActive = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0, 0.75],
    });
    
    this._iconOpacityInactive = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.8, 0  ],
    });

    this._borderOpacity = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.4, 0.5],
    });

    this._borderWidth = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [2, 3  ],
    });

    this._titleFontWeight = floor(
      interpolate(this._progress, {
        inputRange : [0, 50],
        outputRange: [6, 8],
        extrapolate: Extrapolate.CLAMP
      })
    );

    this._titleScale = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [1, 1.10],
    });

    this._titleTransX = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0, 7],
    });

    this._titleTransY = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0, -0.5],
    });

    this._subtitleOpacity = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.5, 0.9],
    });
  };

  componentDidMount(){
    const { inputRef } = this.props;
    inputRef && inputRef(this.textInputRef);
  };

  isValid = (animate) => {
    const { validate } = this.props;
    const { textInput,mode } = this.state;

    const isValid = validate && validate(textInput);
    if(!isValid && animate){
      this.inputContainerRef.shake(750);
      this.setState({
        mode: MODES.INVALID
      });
    };

    return isValid;
  };

  getText = () => {
    const { textInput } = this.state;
    return textInput;
  };

  getProps = () => {
    const { style, onFocus, onBlur, onSubmitEditing, onChangeText, ...props } = this.props;
    return props;
  };
  
  _handleOnTextFocus = () => {
    this.setState({mode: MODES.FOCUSED});
    const animation = timing(this._progress, {
      duration: 300,
      toValue : 100,
      easing  : Easing.inOut(Easing.ease)
    });

    animation.start();
    this.inputContainerRef.pulse(750);
  };

  _handleOnTextBlur = () => {
    const { onBlur } = this.props;
    const { textInput } = this.state;

    const animation = timing(this._progress, {
      duration: 300,
      toValue : 0,
      easing  : Easing.inOut(Easing.ease)
    });

    animation.start();

    const mode = (this.isValid(true)
      ? MODES.BLURRED
      : MODES.INVALID
    );

    onBlur && onBlur({textInput, mode});
    this.setState({mode});
  };

  _handleOnChangeText = (input) => {
    this.setState({textInput: input});
  };

  _handleOnSubmitEditing = ({nativeEvent: {text, eventCount, target}}) => {
    const { onSubmitEditing, index } = this.props;
    onSubmitEditing && onSubmitEditing(
      { text, eventCount, target, index }
    );
  };

  render(){
    const { styles } = ModalInputField;
    const { iconActive, iconInactive, ...props } = this.getProps();
    const { mode } = this.state;

    const textInputStyle = (() => {
      switch (mode) {
        case MODES.BLURRED: return {
          color     : GREY[700],
          fontWeight: '300',
        };
        case MODES.FOCUSED: return {
          color     : BLUE[900],
          fontWeight: '600',
        };
        case MODES.INVALID: return {
          color     : RED[700],
          fontWeight: '300',
        };
      };
    })();

    const tintColor = (() => {
      switch (mode) {
        case MODES.BLURRED: return BLUE[800];
        case MODES.FOCUSED: return BLUE.A700;
        case MODES.INVALID: return RED.A700;
      };
    })();

    const inputBackgoundStyle = {
      opacity: this._bgOpacity,
    };

    const inputBorder = {
      opacity: this._borderOpacity,
      borderWidth: this._borderWidth,
      borderColor: tintColor,
    };

    const iconActiveStyle = {
      opacity: this._iconOpacityActive,
    };

    const iconInctiveStyle = {
      opacity: this._iconOpacityInactive,
    };

    const textTitleStyle = {
      fontWeight: concat(this._titleFontWeight, '00'),
      transform: [
        { scale     : this._titleScale  },
        { translateX: this._titleTransX },
        { translateY: this._titleTransY },
      ],
      color: (
       (mode === MODES.BLURRED)? INDIGO[1100] :
       (mode === MODES.FOCUSED)? INDIGO[1000] :
       (mode === MODES.INVALID)? RED   [900 ] : null
      ),
    };

   const textSubtitleStyle = {
     opacity: this._subtitleOpacity,
     color: (
       (mode === MODES.BLURRED)? GREY[900] :
       (mode === MODES.FOCUSED)? GREY[800] :
       (mode === MODES.INVALID)? RED [900] : null
     ),
   };

   const iconProps = {
     fill  : tintColor,
     stroke: tintColor,
   };

    return(
      <Fragment>
        <View style={styles.titleContainer}>
          <ListItemBadge
            value={props.index + 1}
            color={(
              (mode === MODES.BLURRED)? INDIGO.A400 :
              (mode === MODES.FOCUSED)? INDIGO.A700 :
              (mode === MODES.INVALID)? RED   .A700 : null
            )}
          />
          <Reanimated.Text style={[styles.textTitle, textTitleStyle]}>
            {props.title}
          </Reanimated.Text>
        </View>
        <Reanimated.Text style={[styles.textSubtitle, textSubtitleStyle]}>
          {props.subtitle}
        </Reanimated.Text>
        <Animatable.View 
          style={styles.inputContainer}
          ref={r => this.inputContainerRef = r}
          useNativeDriver={true}
        >
          <Reanimated.View style={[styles.inputBackgound, inputBackgoundStyle]}/>
          <Reanimated.View style={[styles.inputBorder, inputBorder]}/>
          <View style={styles.iconWrapper}>
            <Reanimated.View style={[styles.iconContainer, iconActiveStyle]}>
              {iconActive && React.cloneElement(iconActive, iconProps)}
            </Reanimated.View>
            <Reanimated.View style={[styles.iconContainer, iconInctiveStyle]}>
              {iconInactive && React.cloneElement(iconInactive, iconProps)}
            </Reanimated.View>
          </View>
          <TextInput
            style={[styles.textInput, textInputStyle]}
            ref={r => this.textInputRef = r}
            onFocus={this._handleOnTextFocus}
            onBlur={this._handleOnTextBlur}
            onSubmitEditing={this._handleOnSubmitEditing}
            onChangeText={this._handleOnChangeText}
            placeholder={props.placeholder}
            maxLength={300}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'next'}
            placeholderTextColor={GREY[700]}
            {...{props}}
          />
        </Animatable.View>
      </Fragment>
    );
  };
};