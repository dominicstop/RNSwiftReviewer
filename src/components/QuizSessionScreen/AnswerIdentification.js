import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';

import Reanimated from 'react-native-reanimated';

import { Easing   } from 'react-native-reanimated';
import { iOSUIKit } from 'react-native-typography';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { INSET_BOTTOM, BORDER_WIDTH } from 'app/src/constants/UIValues';

const { Value, Extrapolate, interpolate, timing, sub } = Reanimated;

const BOTTOM_MARGIN = (21 + INSET_BOTTOM);


export class AnswerIdentification extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: Helpers.hexToRGBA(Colors.BLUE.A700, 0.8),
      borderTopColor: Helpers.hexToRGBA(Colors.BLUE[900], 0.5),
      borderTopWidth: BORDER_WIDTH,
    },
    inputContainer: {
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginTop: 15,
      marginBottom: 25,
      marginHorizontal: 12,
      borderRadius: 10,
    },
    inputBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'white',
    },
    textInput: {
      flex: 1,
      fontSize: 14,
      fontWeight:'600',
      color: Helpers.hexToRGBA(Colors.BLUE.A700, 0.9),
    },
    textInputFocused: {
      fontWeight:'800',
      color: Helpers.hexToRGBA(Colors.BLUE[1000], 0.8),
    },
  });

  constructor(props){
    super(props);

    this.keyboardHeight = 0;
    
    this. progress           = new Value(0);
    this.keyboardHeightValue = new Value(0);

    this._height = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [0, sub(this.keyboardHeightValue, BOTTOM_MARGIN)],
      extrapolate: Extrapolate.CLAMP,
    });

    this._borderRadius = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [0, 15],
      extrapolate: Extrapolate.CLAMP,
    });

    this.state = {
      keyboardVisible: false,
      inputFocused: false,
      textInput: '',
    };
  };

  componentDidUpdate(prevProps){
    const nextProps = this.props;
    const { keyboardVisible } = this.state;

    const prevIsFocused = prevProps.isFocused;
    const nextIsFocused = nextProps.isFocused;

    const didUnfocused = (
      prevIsFocused && !nextIsFocused
    );

    if(didUnfocused && keyboardVisible){
      // trigger manual keyboard hide animation
      this.progress.setValue(0);
      this.setState({ keyboardVisible: false });
    };
  };

  // this is triggered from QuizSessionScreen
  _onKeyboardWillShowHide = (event, visible) => {
    const { keyboardVisible } = this.state;
    const { duration, endCoordinates } = event;
    const keyboardHeight = endCoordinates.height;

    if(this.keyboardHeight == 0){
      this.keyboardHeight = keyboardHeight;
      this.keyboardHeightValue.setValue(keyboardHeight);
    };

    const animation = timing(this.progress, {
      easing  : Easing.bezier(0.17, 0.59, 0.4, 0.77),
      toValue : (visible? 100 : 0),
      duration: (duration / 1.5 ),
    });

    if(keyboardVisible != visible){
      this.setState({ keyboardVisible: visible });
      animation.start();
    };
  };

  _handleOnFocus = ({nativeEvent}) => {
    this.setState({
      text: nativeEvent.text,
      inputFocused: true,
    });
  };

  _handleOnBlur = ({nativeEvent}) => {
    this.setState({
      text: nativeEvent.text,
      inputFocused: false,
    });
  };

  render(){
    const { styles } = AnswerIdentification;
    const { inputFocused } = this.state;

    const rootContainerStyle = {
      borderTopLeftRadius : this._borderRadius,
      borderTopRightRadius: this._borderRadius,
    };

    return(
      <Reanimated.View style={[styles.rootContainer, rootContainerStyle]}>
        <View style={styles.inputContainer}>
          <View style={styles.inputBackground}/>
          <TextInput
            style={[styles.textInput, (inputFocused && styles.textInputFocused)]}
            onBlur={this._handleOnBlur}
            onFocus={this._handleOnFocus}
            placeholder={'Type your answer...'}
            placeholderTextColor={(inputFocused
              ? Helpers.hexToRGBA(Colors.BLUE[900], 0.5)
              : Helpers.hexToRGBA(Colors.BLUE.A700, 0.6)
            )}
          />
        </View>
        <Reanimated.View
          style={{ marginBottom: this._height }}
        />
      </Reanimated.View>
    );
  };
};