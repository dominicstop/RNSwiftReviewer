import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

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
      colorIcon       : Colors.BLUE[800],
      colorBorder     : Colors.BLUE[800],
      colorInput      : Helpers.hexToRGBA(Colors.BLUE[900], 0.75),
      colorTitle      : Colors.INDIGO[1100],
      colorSubtitle   : Colors.GREY[900],
      colorPlaceholder: Helpers.hexToRGBA(Colors.BLUE[1000], 0.5),
      colorItemBadge  : Colors.INDIGO.A400 ,
      colorBackground : 'rgba(245,245,255, 0.75)',
      fontWeightInput : '700',
    };
    case MODES.FOCUSED: return {
      colorIcon       : Colors.BLUE.A700 ,
      colorBorder     : Colors.BLUE.A700 ,
      colorInput      : Colors.BLUE[1000],
      colorTitle      : Colors.INDIGO[900],
      colorSubtitle   : Colors.GREY[800],
      colorPlaceholder: Helpers.hexToRGBA(Colors.BLUE[900], 0.8),
      colorItemBadge  : Colors.INDIGO.A700 ,
      colorBackground : 'white',
      fontWeightInput : '700',
    };
    case MODES.INVALID: return {
      colorIcon       : Colors.RED.A700,
      colorBorder     : Colors.RED.A700,
      colorInput      : Colors.RED[700],
      colorTitle      : Colors.RED[900],
      colorSubtitle   : Colors.RED[700],
      colorPlaceholder: Helpers.hexToRGBA(Colors.RED[900], 0.5),
      colorItemBadge  : Colors.RED.A700,
      colorBackground : Helpers.hexToRGBA(Colors.RED[50], 0.5),
      fontWeightInput : '700',
    };
  };
};

export class ModalInputField extends React.PureComponent {
  static propTypes = {
    title       : PropTypes.string,
    subtitle    : PropTypes.string,
    placeholder : PropTypes.string,
    initialValue: PropTypes.string,
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
      borderColor: Colors.BLUE.A700,
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
      ...iOSUIKit.bodyObject,
      fontSize: 20,
      marginLeft: 7,
      textAlignVertical: 'center',
      marginBottom: 1,
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
      textInput: props.initialValue ?? '',
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
      outputRange: [0, 20],
    });

    this._titleTransY = interpolate(this._progress, {
      inputRange : [0, 100],
      outputRange: [0, -0.5],
    });

    this._subtitleOpacity = interpolate(this._progress, {
      inputRange : [0  , 100],
      outputRange: [0.7, 1],
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
    const { mode, textInput: value } = this.state;

    const values = deriveStateFromMode(mode);

    const textInputStyle = {
      color     : values.colorInput,
      fontWeight: values.fontWeightInput,
    };

    const inputBorder = {
      opacity    : this._borderOpacity,
      borderWidth: this._borderWidth  ,
      borderColor: values.colorBorder ,
    };

    const inputBackgoundStyle = {
      opacity: this._bgOpacity,
      backgroundColor: values.colorBackground,
    };

    const iconActiveStyle = {
      opacity: this._iconOpacityActive,
    };

    const iconInctiveStyle = {
      opacity: this._iconOpacityInactive,
    };

    const titleContainerStyle = {
      transform: [
        { scale     : this._titleScale  },
        { translateX: this._titleTransX },
        { translateY: this._titleTransY },
      ],
    };

    const textTitleStyle = {
      color     : values.colorTitle,
      fontWeight: concat(this._titleFontWeight, '00'),
    };

   const textSubtitleStyle = {
     color  : values.colorSubtitle ,
     opacity: this._subtitleOpacity,
   };

   const iconProps = {
     fill  : values.colorIcon,
     stroke: values.colorIcon,
   };

    return(
      <Fragment>
        <Reanimated.View style={[styles.titleContainer, titleContainerStyle]}>
          <ListItemBadge
            value={props.index + 1}
            color={values.colorItemBadge}
            size={18}
          />
          <Reanimated.Text style={[styles.textTitle, textTitleStyle]}>
            {props.title}
          </Reanimated.Text>
        </Reanimated.View>
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
            placeholderTextColor={values.colorPlaceholder}
            maxLength={300}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'next'}
            {...{value, ...props}}
          />
        </Animatable.View>
      </Fragment>
    );
  };
};