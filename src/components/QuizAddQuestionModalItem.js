import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography'; 

import { ModalSection } from 'app/src/components/ModalSection';
import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { SectionTypes } from 'app/src/constants/SectionTypes';
import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';

import * as Colors from 'app/src/constants/Colors';

// used in modals/QuizAddQuestionModal
// renderItem component, question item
export class QuizAddQuestionModalItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingTop: 7,
      paddingBottom: 7,
      paddingHorizontal: 12,
    },
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
      color: Colors.GREY[800],
    },
    textAnswerLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      color: Colors.BLUE[1100],
      fontWeight: '600',
    },
  });

  _handleOnPressQuestionItem = async () => {
    const { index, onPressQuestionItem, ...props } = this.props;
    const question = QuizQuestionModel.extract(props);

    await this.rootContainerRef.pulse(300);
    onPressQuestionItem && onPressQuestionItem(
      { index, question }
    );
  };

  render(){
    const { styles } = QuizAddQuestionModalItem;
    const { index, ...props } = this.props;

    const question    = props[QuizQuestionKeys.questionText];
    const answer      = props[QuizQuestionKeys.questionAnswer];
    const sectionType = props[QuizQuestionKeys.sectionType];
    
    const displayAnswer = ((sectionType == SectionTypes.TRUE_OR_FALSE)
      ? (answer? 'True' : 'False')
      : answer
    );

    return(
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <ModalSection 
          hasMarginBottom={props.isLast}
          showBorderTop={false}
          hasPadding={false}
        >
          <TouchableOpacity
            style={styles.rootContainer}
            activeOpacity={0.75}
            onPress={this._handleOnPressQuestionItem}
          >
            <Text numberOfLines={5}>
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
                {displayAnswer}
              </Text>
            </Text>
          </TouchableOpacity>
        </ModalSection>
      </Animatable.View>
    );
  };
};