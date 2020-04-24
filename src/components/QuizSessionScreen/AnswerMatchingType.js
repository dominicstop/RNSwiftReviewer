import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';
import { iOSUIKit } from 'react-native-typography';
import { QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';


class InactiveButton extends React.PureComponent {
  static styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 13,
      marginBottom: 20,
      marginHorizontal: 13,
      borderWidth: 1,
      borderColor: Helpers.hexToRGBA(Colors.BLUE[900], 0.25),
      paddingVertical: 5,
      paddingHorizontal: 12,
      backgroundColor: 'white',
      borderRadius: 10,
      //shadow
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 1.41,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    buttonTextTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      flex: 1,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '700',
      color: Colors.BLUE.A700,
    },
  });

  render(){
    const { styles } = InactiveButton;
    const props = this.props;

    return (
      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={props.onPressChooseAnswer}
      >
        <Ionicon
          name={'ios-filing'}
          color={Colors.BLUE.A700}
          size={26}
        />
        <Text style={styles.buttonTextTitle}>
          {'Choose Answer...'}
        </Text>
      </TouchableOpacity>
    );
  };
};

class ActiveButton extends React.PureComponent {
  static styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 13,
      marginBottom: 20,
      marginHorizontal: 13,
      backgroundColor: 'white',
      borderRadius: 10,
      //shadow
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 1.41,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    iconContainer: {
      backgroundColor: Colors.BLUE[900],
      paddingHorizontal: 14,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    },
    textContainer: {
      flex: 1,
      marginHorizontal: 10,
      marginVertical: 5,
    },
    buttonTextTitle: {
      ...iOSUIKit.subheadEmphasizedObject,
      flex: 1,
      fontWeight: '800',
      color: Colors.BLUE.A700,
    },
    buttonTextSubtitle: {
      ...iOSUIKit.footnoteObject,
      color: Colors.BLUE[1000],
      opacity: 0.9,
      marginTop: -2,
    },
  });

  render(){
    const { styles } = ActiveButton;
    const { answer, ...props } = this.props;

    const answerText = answer[QuizSessionAnswerKeys.answerValue];

    return (
      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={props.onPressChooseAnswer}
      >
        <View style={styles.iconContainer}>
          <Ionicon
            name={'ios-filing'}
            color={'white'}
            size={26}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonTextTitle}>
            {answerText}
          </Text>
          <Text style={styles.buttonTextSubtitle}>
            {'Tap to change your answer...'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
};

export class AnswerMatchingType extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: Helpers.hexToRGBA(Colors.BLUE.A700, 0.9),
    },
  });

  _handleOnPressChooseAnswer = () => {
    const { onPressChooseAnswer, answer, ...props } = this.props;

    // extract question values from props
    const question = QuizQuestionModel.extract(props);
    
    onPressChooseAnswer && onPressChooseAnswer(question, answer);
  };

  render(){
    const { styles } = AnswerMatchingType;
    const { question, answer } = this.props;
    const hasAnswer = (answer !== undefined);

    return (
      <View style={styles.rootContainer}>
        {hasAnswer? (
          <ActiveButton
            onPressChooseAnswer={this._handleOnPressChooseAnswer}
            {...{question, answer}}
          />
        ):(
          <InactiveButton
            onPressChooseAnswer={this._handleOnPressChooseAnswer}
            {...{question, answer}}
          />
        )}
      </View>
    );
  };
};