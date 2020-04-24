import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import * as Animatable from 'react-native-animatable';
import SegmentedControl from '@react-native-community/segmented-control';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';
import { QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';


export class AnswerTrueOrFalse extends React.Component {
  _handleSegmentOnChange = ({nativeEvent}) => {
    const { selectedSegmentIndex } = nativeEvent;
    const { onAnswerSelected, ...props } = this.props;

    // extract question from props
    const question = QuizQuestionModel.extract(props);

    this.rootContainerRef.pulse(500);
    this.segmentedContainerRef.pulse(300);

    onAnswerSelected && onAnswerSelected({
      answer: (selectedSegmentIndex == 0),
      question,
    });
  };

  render(){
    const { answer } = this.props;
    const hasAnswer = (answer != undefined);
    const answerValue = answer?.[QuizSessionAnswerKeys.answerValue];

    return(
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        style={styles.rootContainer}
        useNativeDriver={true}
      >
        <Animatable.View 
          ref={r => this.segmentedContainerRef = r}
          style={styles.segmentedContainer}
          useNativeDriver={true}
        >
          <SegmentedControl
            style={styles.segmentedControl}
            onChange={this._handleSegmentOnChange}
            values={['True', 'False']}
            textColor={Colors.BLUE[1000]}
            activeTextColor={'white'}
            tintColor={Colors.BLUE.A700}
            appearance={'light'}
            backgroundColor={'white'}
            selectedIndex={(hasAnswer
              ? (answerValue? 0 : 1)
              : undefined
            )}
          />
        </Animatable.View>
      </Animatable.View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: Helpers.hexToRGBA(Colors.BLUE.A700, 0.8),
  },
  segmentedContainer: {
    marginTop: 12,
    marginBottom: 20,
    marginHorizontal: 13,
    borderWidth: 1,
    borderColor: Helpers.hexToRGBA(Colors.BLUE[900], 0.25),
  },
  segmentedControl: {
    height: 33,
  },
});