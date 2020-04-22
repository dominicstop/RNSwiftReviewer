import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import SegmentedControl from '@react-native-community/segmented-control';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';


export class AnswerTrueOrFalse extends React.PureComponent {

  _handleSegmentOnChange = ({nativeEvent}) => {
    const { selectedSegmentIndex } = nativeEvent;
    const { onAnswerSelected, ...props } = this.props;

    // extract question from props
    const question = QuizQuestionModel.extract(props);

    onAnswerSelected && onAnswerSelected({
      answer: (selectedSegmentIndex == 0),
      question,
    });
  };

  render(){
    return(
      <View style={styles.rootContainer}>
        <View style={styles.segmentedContainer}>
          <SegmentedControl
            style={styles.segmentedControl}
            onChange={this._handleSegmentOnChange}
            values={['True', 'False']}
            textColor={Colors.BLUE[1000]}
            activeTextColor={'white'}
            tintColor={Colors.BLUE.A700}
            appearance={'light'}
            backgroundColor={'white'}
          />
        </View>
      </View>
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