import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';

import Reanimated from 'react-native-reanimated';

import { Easing   } from 'react-native-reanimated';
import { iOSUIKit } from 'react-native-typography';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { INSET_BOTTOM } from 'app/src/constants/UIValues';

const { Value, Extrapolate, interpolate, timing, sub } = Reanimated;

const BOTTOM_MARGIN = (10 + INSET_BOTTOM);


export class AnswerIdentification extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
    },
    textInput: {
      ...iOSUIKit.bodyObject,
      backgroundColor: 'white',
      borderRadius: 10,
      margin: 10,
      padding: 6,
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

    this.state = {
      keyboardVisible: false,
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
      duration: (duration / 1.75 ),
    });

    if(keyboardVisible != visible){
      this.setState({ keyboardVisible: visible });
      animation.start();
    };
  };

  render(){
    const { styles } = AnswerIdentification;

    return(
      <View style={styles.rootContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={'Type your answer...'}
          placeholderTextColor={'black'}
        />
        <Reanimated.View
          style={{ marginBottom: this._height }}
        />
      </View>
    );
  };
};