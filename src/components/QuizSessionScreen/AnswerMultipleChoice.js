import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { iOSUIKit } from 'react-native-typography';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';

const colorsAdj = [
  Helpers.hexToRGBA(Colors.BLUE[700 ], 0.9),
  Helpers.hexToRGBA(Colors.BLUE[800 ], 0.9),
  Helpers.hexToRGBA(Colors.BLUE[900 ], 0.9),
  Helpers.hexToRGBA(Colors.BLUE[1000], 0.9),
];

const bgColors = [
  [colorsAdj[0]],
  [colorsAdj[1], colorsAdj[2]],
  [colorsAdj[1], colorsAdj[2], colorsAdj[3]],
  [colorsAdj[0], colorsAdj[1], colorsAdj[2], colorsAdj[3]],
];

export class AnswerMultipleChoice extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      margin: 10,
      overflow: 'hidden',
      borderRadius: 10,
    },
    choiceContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    textChoice: {
      ...iOSUIKit.subheadWhiteObject,
    },
  });

  _handleOnPressChoice = (choice, index) => {
    const { onAnswerSelected, ...props } = this.props;

    // extract question from props
    const question = QuizQuestionModel.extract(props);

    onAnswerSelected && onAnswerSelected({
      answer: choice,
      question,
    });
  };

  render(){
    const { styles } = AnswerMultipleChoice;
    const props = this.props;

    const choices      = props[QuizQuestionKeys.questionChoices] ?? [];
    const choicesCount = choices.length;

    return(
      <View style={styles.rootContainer}>
        {choices.map((choice, index) => {
          const backgroundColor = bgColors[choicesCount - 1][index];

          return(
            <TouchableOpacity
              key={`choice-${choice}`}
              activeOpacity={0.9}
              style={[styles.choiceContainer, {backgroundColor}]}
              onPress={() => {
                this._handleOnPressChoice(choice, index);
              }}
            >
              <Text style={styles.textChoice}>
                {choice}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
};