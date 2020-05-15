import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import Reanimated from 'react-native-reanimated';
import { Easing } from 'react-native-reanimated';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';
import { QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';
import { INSET_BOTTOM, BORDER_WIDTH } from 'app/src/constants/UIValues';

const { Value, Extrapolate, interpolate, timing, sub } = Reanimated;
const BOTTOM_MARGIN = (21 + INSET_BOTTOM);


export class AnswerIdentification extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
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
      fontWeight:'700',
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

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    // check if answer obj from props
    const prevAnswer = prevProps?.answer ?? {};
    const nextAnswer = nextProps?.answer ?? {};
    // get answer value from answer obj
    const prevAnsVal = prevAnswer[QuizSessionAnswerKeys.answerValue];
    const nextAnsVal = nextAnswer[QuizSessionAnswerKeys.answerValue];

    return(
      // check if props changed
      (prevAnsVal         != nextAnsVal        ) ||
      (prevProps.bookmark != nextProps.bookmark) ||
      // check if state changed
      (prevState.textInput       != nextState.textInput      ) ||
      (prevState.inputFocused    != nextState.inputFocused   ) ||
      (prevState.keyboardVisible != nextState.keyboardVisible)
    );
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
    const { text } = nativeEvent;
    const { onAnswerSelected, ...props } = this.props;

    // extract question values from props
    const question = QuizQuestionModel.extract(props);
    onAnswerSelected && onAnswerSelected({
      answer: text,
      question,
    });

    this.setState({ 
      inputFocused: false,
      text,
    });
  };

  render(){
    const { styles } = AnswerIdentification;
    const { answer, bookmark } = this.props;
    const { inputFocused } = this.state;

    // get answer value from answer obj
    const answerValue = answer?.[QuizSessionAnswerKeys.answerValue];
    const hasBookmark = (bookmark != undefined);

    const rootContainerStyle = {
      borderTopLeftRadius : this._borderRadius,
      borderTopRightRadius: this._borderRadius,
      ...(hasBookmark? {
        borderTopColor : Helpers.hexToRGBA(Colors.ORANGE[900], 0.5),
        backgroundColor: Helpers.hexToRGBA(Colors.ORANGE.A700, 0.8),
      }:{
        borderTopColor : Helpers.hexToRGBA(Colors.BLUE[900], 0.5),
        backgroundColor: Helpers.hexToRGBA(Colors.BLUE.A700, 0.8),
      }),
    };

    const colorFocused = (hasBookmark
      ? Helpers.hexToRGBA(Colors.ORANGE[900 ], 0.8)
      : Helpers.hexToRGBA(Colors.BLUE  [1000], 0.8)
    );

    const colorBlurred = (hasBookmark
      ? Helpers.hexToRGBA(Colors.ORANGE[800], 0.8)
      : Helpers.hexToRGBA(Colors.BLUE  [900], 0.8)
    );

    const textInputStyle = {
      ...(inputFocused && {
        fontWeight: '800',
      }),
      color: (inputFocused
        ? colorFocused
        : colorBlurred
      ),
    };

    return(
      <Reanimated.View style={[styles.rootContainer, rootContainerStyle]}>
        <View style={styles.inputContainer}>
          <View style={styles.inputBackground}/>
          <TextInput
            style={[styles.textInput, textInputStyle]}
            defaultValue={answerValue}
            onBlur={this._handleOnBlur}
            onFocus={this._handleOnFocus}
            placeholder={'Type your answer...'}
            returnKeyType={'done'}
            placeholderTextColor={hasBookmark
              ? (inputFocused
                ? Helpers.hexToRGBA(Colors.ORANGE[900], 0.5)
                : Helpers.hexToRGBA(Colors.ORANGE.A700, 0.6)
              ):(inputFocused
                ? Helpers.hexToRGBA(Colors.BLUE[900], 0.5)
                : Helpers.hexToRGBA(Colors.BLUE.A700, 0.6)
              )
            }
            selectionColor={(hasBookmark
              ? Colors.ORANGE[900]
              : Colors.BLUE.A700
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