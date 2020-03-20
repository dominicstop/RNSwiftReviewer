import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ModalSection } from 'app/src/components/ModalSection';

import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { iOSUIKit } from 'react-native-typography';

import * as Colors   from 'app/src/constants/Colors';

// used in modals/QuizAddQuestionModal
// renderItem component, question item
export class ModalQuizAddQuestionItem extends React.PureComponent {
  static styles = StyleSheet.create({
    textQuestionIndicator: {
      ...iOSUIKit.subheadEmphasizedObject,
      fontWeight: '700',
      color: Colors.BLUE.A700,
    },
    textQuestionBody: {
      ...iOSUIKit.subheadObject,
    },
    textAnswer: {
      ...iOSUIKit.subheadObject,
    },
    textAnswerLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
    },
  });

  render(){
    const { styles } = ModalQuizAddQuestionItem;
    const { index, ...props } = this.props;

    const question = props[QuizQuestionKeys.questionText];
    const answer   = props[QuizQuestionKeys.questionAnswer];

    return(
      <ModalSection>
        <Text numberOfLines={3}>
          <Text style={styles.textQuestionIndicator}>
            {`${index + 1}. `}
          </Text>
          <Text style={styles.textQuestionBody}>
            {question}
          </Text>
        </Text>
        <Text>
          <Text style={styles.textAnswerLabel}>
            {'Answer: '}
          </Text>
          <Text style={styles.textAnswer}>
            {answer}
          </Text>
        </Text>
      </ModalSection>
    );
  };
};