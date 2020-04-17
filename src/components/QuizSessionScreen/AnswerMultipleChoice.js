import React from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { iOSUIKit } from 'react-native-typography';

const bgColors = [
  Helpers.hexToRGBA(Colors.BLUE[700 ], 0.9),
  Helpers.hexToRGBA(Colors.BLUE[800 ], 0.9),
  Helpers.hexToRGBA(Colors.BLUE[900 ], 0.9),
  Helpers.hexToRGBA(Colors.BLUE[1000], 0.9),
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


  render(){
    const { styles } = AnswerMultipleChoice;
    const props = this.props;

    const choices = props[QuizQuestionKeys.questionChoices] ?? [];

    return(
      <View style={styles.rootContainer}>
        {choices.map((choice, index) => (
          <View
            style={[styles.choiceContainer, {backgroundColor: bgColors[index]}]}
            key={`choice-${choice}`}
          >
            <Text style={styles.textChoice}>
              {choice}
            </Text>
          </View>
        ))}
      </View>
    );
  };
};