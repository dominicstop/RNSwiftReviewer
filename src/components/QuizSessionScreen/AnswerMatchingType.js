import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import { iOSUIKit } from 'react-native-typography';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';
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
      shadowColor: 'rgba(0,0,0,0.15)',
      shadowOpacity: 1,
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

    const buttonTextTitleStyle = {
      color: (props.hasBookmark
        ? Colors.ORANGE[900]
        : Colors.BLUE  .A700
      ),
    };

    return (
      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={props.onPressChooseAnswer}
      >
        <Ionicon
          size={26}
          name={'ios-filing'}
          color={(props.hasBookmark
            ? Colors.ORANGE[900]
            : Colors.BLUE  .A700
          )}
        />
        <Text style={[styles.buttonTextTitle, buttonTextTitleStyle]}>
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
      shadowColor: 'rgba(0,0,0,0.15)',
      shadowOpacity: 1,
      shadowRadius: 1.41,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    iconContainer: {
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
    },
    buttonTextSubtitle: {
      ...iOSUIKit.footnoteObject,
      color: Colors.GREY[700],
      opacity: 0.9,
      marginTop: -2,
    },
  });

  render(){
    const { styles } = ActiveButton;
    const { answer, hasBookmark, ...props } = this.props;
    const answerText = answer[QuizSessionAnswerKeys.answerValue];

    const iconContainerStyle = {
      backgroundColor: (hasBookmark
        ? Colors.ORANGE[900]
        : Colors.BLUE  [900]
      ),
    };

    const buttonTextTitleStyle = {
      color: (hasBookmark
        ? Colors.ORANGE[900]
        : Colors.BLUE  .A700
      ),
    };

    return (
      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={props.onPressChooseAnswer}
      >
        <View style={[styles.iconContainer, iconContainerStyle]}>
          <Ionicon
            name={'ios-filing'}
            color={'white'}
            size={26}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.buttonTextTitle, buttonTextTitleStyle]}>
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
  _handleOnPressChooseAnswer = () => {
    const { onPressChooseAnswer, answer, ...props } = this.props;

    // extract question values from props
    const question = QuizQuestionModel.extract(props);
    
    onPressChooseAnswer && onPressChooseAnswer(question, answer);
  };

  render(){
    const { question, answer, bookmark } = this.props;

    const hasAnswer   = (answer   != undefined);
    const hasBookmark = (bookmark != undefined);

    const backgroundColor = (hasBookmark
      ? Helpers.hexToRGBA(Colors.ORANGE.A700, 0.75)
      : Helpers.hexToRGBA(Colors.BLUE  .A700, 0.9 )
    );

    return (
      <View style={{backgroundColor}}>
        {hasAnswer? (
          <ActiveButton
            onPressChooseAnswer={this._handleOnPressChooseAnswer}
            {...{question, answer, hasBookmark}}
          />
        ):(
          <InactiveButton
            onPressChooseAnswer={this._handleOnPressChooseAnswer}
            {...{question, answer, hasBookmark}}
          />
        )}
      </View>
    );
  };
};