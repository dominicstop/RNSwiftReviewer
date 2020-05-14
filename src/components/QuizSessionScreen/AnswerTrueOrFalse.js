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
    const { answer, bookmark } = this.props;
    const answerValue = answer?.[QuizSessionAnswerKeys.answerValue];

    const hasAnswer   = (answer   != undefined);
    const hasBookmark = (bookmark != undefined);

    const backgroundColor = (hasBookmark
      ? Helpers.hexToRGBA(Colors.ORANGE.A700, 0.7)
      : Helpers.hexToRGBA(Colors.BLUE  .A700, 0.9)
    );

    const segmentedControlProps = hasBookmark? {
      textColor: Colors.ORANGE[900],
      tintColor: Colors.ORANGE.A700,
    }:{
      textColor: Colors.BLUE[1000],
      tintColor: Colors.BLUE.A700,
    };

    return(
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        style={{backgroundColor}}
        useNativeDriver={true}
      >
        <Animatable.View 
          ref={r => this.segmentedContainerRef = r}
          style={styles.segmentedContainer}
          useNativeDriver={true}
        >
          <SegmentedControl
            {...segmentedControlProps}
            style={styles.segmentedControl}
            onChange={this._handleSegmentOnChange}
            values={['True', 'False']}
            activeTextColor={'white'}
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
  },
  segmentedControl: {
    height: 33,
  },
});