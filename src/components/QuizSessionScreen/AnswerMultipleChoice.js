import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Chroma from 'chroma-js';
import Ionicon from '@expo/vector-icons/Ionicons';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';
import { QuizQuestionKeys, QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';


const scaleBlue = Chroma.scale([
  Colors.BLUE[800 ],
  Colors.BLUE[900 ],
  Colors.BLUE[1000],
]);

const scaleOrange = Chroma.scale([
  Colors.ORANGE[700 ],
  Colors.ORANGE[800 ],
  Colors.ORANGE[900 ],
  Colors.ORANGE[1000],
]);

const bgColorsBlue = Array.from({length: 10},
  (x, i) => (scaleBlue.colors(i))
);

const bgColorsOrange = Array.from({length: 10},
  (x, i) => (scaleOrange.colors(i))
);

class ChoiceItem extends React.Component {
  static styles = StyleSheet.create({
    choiceContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 6,
      alignItems: 'center',
    },
    textLetter: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
    },
    textLetterSelected: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      fontWeight: '900'
    },
    textChoice: {
      ...iOSUIKit.subheadWhiteObject,
      flex: 1,
      marginLeft: 10,
    },
    textChoiceSelected: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      flex: 1,
      marginLeft: 10,
      fontWeight: '800'
    },
  });

  shouldComponentUpdate(nextProps){
    const prevProps = this.props;
    
    return (
      (prevProps.index        != nextProps.index       ) ||
      (prevProps.choice       != nextProps.choice      ) ||
      (prevProps.isSelected   != nextProps.isSelected  ) ||
      (prevProps.hasBookmark  != nextProps.hasBookmark ) ||
      (prevProps.choicesCount != nextProps.choicesCount)
    );
  };

  _handleOnPressChoice = () => {
    const { choice, index, onPressChoice } = this.props;

    onPressChoice && onPressChoice(choice, index);
    this.rootContainerRef.pulse(300);
  };

  render(){
    const { styles } = ChoiceItem;
    const { index, choice, choicesCount, isSelected, hasBookmark } = this.props;

    return(
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <TouchableOpacity
          key={`choice-${choice}`}
          activeOpacity={0.9}
          onPress={this._handleOnPressChoice}
          style={[styles.choiceContainer, (isSelected?{
            backgroundColor: (hasBookmark
              ? Colors.YELLOW.A700 
              : Colors.INDIGO.A700 
            )
          }:{
            backgroundColor: (hasBookmark
              ? bgColorsOrange[choicesCount][index]
              : bgColorsBlue  [choicesCount][index]
            )
          })]}
        >
          <Text style={(isSelected
            ? styles.textLetterSelected
            : styles.textLetter
          )}>
            {Helpers.getLetter(index)}
          </Text>
          <Text style={(isSelected
            ? styles.textChoiceSelected
            : styles.textChoice
          )}>
            {choice}
          </Text>
          {(isSelected) && (
            <Animatable.View
              animation={'fadeInRight'}
              duration={250}
              useNativeDriver={true}
            >
              <Ionicon
                name={'ios-checkmark-circle'}
                color={'white'}
                size={18}
              />
            </Animatable.View>
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};

export class AnswerMultipleChoice extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      margin: 10,
      overflow: 'hidden',
      borderRadius: 10,
    },
  });

  shouldComponentUpdate(nextProps){
    const prevProps = this.props;

    const prevAnswer = prevProps?.answer ?? {};
    const nextAnswer = nextProps?.answer ?? {};

    const prevAnsVal = prevAnswer[QuizSessionAnswerKeys.answerValue];
    const nextAnsVal = nextAnswer[QuizSessionAnswerKeys.answerValue];

    return(
      (prevAnsVal         != nextAnsVal        ) ||
      (prevProps.bookmark != nextProps.bookmark)
    );
  };

  _handleOnPressChoice = (choice, index) => {
    const { onAnswerSelected, ...props } = this.props;

    this.rootContainerRef.pulse(500);

    // extract question from props
    const question = QuizQuestionModel.extract(props);

    onAnswerSelected && onAnswerSelected({
      answer: choice,
      question,
    });
  };

  render(){
    const { styles } = AnswerMultipleChoice;
    const { answer, ...props } = this.props;

    const choices      = props[QuizQuestionKeys.questionChoices] ?? [];
    const choicesCount = choices.length;

    const answerVal   = answer?.[QuizSessionAnswerKeys.answerValue];
    const hasBookmark = (props.bookmark != undefined);

    return(
      <Animatable.View 
        ref={r => this.rootContainerRef = r}
        style={styles.rootContainer}
        useNativeDriver={true}
      >
        {choices.map((choice, index) => (
          <ChoiceItem
            isSelected={(choice == answerVal)}
            onPressChoice={this._handleOnPressChoice}
            {...{choice, choicesCount, index, hasBookmark}}
          />
        ))}
      </Animatable.View>
    );
  };
};