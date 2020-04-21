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

  componentDidMount(){
    // subscribe to event listeners
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  };

  componentWillUnmount() {
    // ubsubsrcibe to event listeners
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  _keyboardWillShow = (event) => {
    const { duration, endCoordinates } = event;
    const { isFocused } = this.props;
    if(!isFocused) return;

    const keyboardHeight = endCoordinates.height;

    if(this.keyboardHeight == 0){
      this.keyboardHeight = keyboardHeight;
      this.keyboardHeightValue.setValue(keyboardHeight);
    };

    this.setState({
      keyboardVisible: true
    });

     const animation = timing(this.progress, {
      easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
      duration: duration / 1.75,
      toValue: 100,
    });

    animation.start();
  };

  _keyboardWillHide = (event) => {
    const { isFocused } = this.props;
    const { duration } = event;
    if(!isFocused) return;

    const animation = timing(this.progress, {
      easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
      toValue: 0,
      duration,
    });

    this.setState({
      keyboardVisible: false
    });

    animation.start();
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