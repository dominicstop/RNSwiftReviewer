import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Feather from '@expo/vector-icons/Feather';
import moment  from 'moment';

import { ModalSection    } from 'app/src/components/ModalSection';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizKeys, QuizQuestionKeys, QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';
import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { iOSUIKit } from 'react-native-typography';
import { ListItemBadge } from '../ListItemBadge';
import { SectionTypes } from 'app/src/constants/SectionTypes';


export class QuestionAnswerItem extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingTop: 10,
      paddingHorizontal: 12,
      paddingBottom: 10,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderBottomWidth: BORDER_WIDTH,
      borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    questionContainer: {
      flexDirection: 'row',
    },
    itemBadge: {
      position: 'absolute',
    },
    textQuestion: {
      ...iOSUIKit.subheadObject,
      marginTop: 0.5,
      color: Colors.GREY[900]
    },
    textNoAnswer: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[700],
      marginTop: 3,
    },
    answerContainer: {
      flexDirection: 'row',
      marginTop: 3,
    },
    textAnswer: {
      ...iOSUIKit.subheadObject,
      flex: 1,
      color: Colors.GREY[700],
    },
    textAnswerLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      color: Colors.BLUE[1100],
    },
    textAnswerTime: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[500],
      marginLeft: 5,
    },
  });

  _handleOnPress = () => {
    const { onPressQuestion, ...props } = this.props;
    
    this.rootContainer.pulse(300);
    onPressQuestion && onPressQuestion({
      index   : props.index   ,
      answer  : props.answer  ,
      question: props.question,
    });
  };

  render(){
    const { styles } = QuestionAnswerItem;
    const { question, answer, currentIndex, index } = this.props;

    const questionText = question?.[QuizQuestionKeys.questionText] ?? 'N/A';

    const answerValue = answer?.[QuizSessionAnswerKeys.answerValue    ] ?? 'N/A';
    const answerTime  = answer?.[QuizSessionAnswerKeys.answerTimestamp] ?? 0;

    const dateAnswerTime = moment.unix(answerTime / 1000);
    const textAnswerTime = dateAnswerTime.format('hh:mm');

    const hasAnswer = (
      (answer != null     ) ||
      (answer != undefined)
    );

    const isActive = (currentIndex == index)
    const rootContainerStyle = {
      ...(isActive && {
        backgroundColor: Colors.BLUE[50]
      })
    };

    return (
      <Animatable.View
        ref={r => this.rootContainer = r}
        style={[styles.rootContainer, rootContainerStyle]}
        useNativeDriver={true}
      >
        <TouchableOpacity 
          onPress={this._handleOnPress}
          activeOpacity={0.5}
        >
          <View style={styles.questionContainer}>
            <ListItemBadge
              size={20}
              initFontSize={12}
              value={(index + 1)}
              textStyle={{fontWeight: '900'}}
              containerStyle={styles.itemBadge}
              color={(isActive
                ? Colors.BLUE.A400
                : Colors.BLUE[100]
              )}
              textColor={(isActive
                ? 'white'
                : Colors.BLUE.A700
              )}
            />
            <Text
              style={styles.textQuestion}
              numberOfLines={3}
            >
              {`       ${questionText}`}
            </Text>
          </View>
          {(hasAnswer)? (
            <View style={styles.answerContainer}>
              <Text 
                style={styles.textAnswer}
                numberOfLines={1}
              >
                <Text style={styles.textAnswerLabel}>
                  {'Answer: '}
                </Text>
                {String(answerValue)}
              </Text>
              <Text style={styles.textAnswerTime}>
                {textAnswerTime}
              </Text>
            </View>
          ):(
            <Text style={styles.textNoAnswer}>
              {'No answer yet...'}
            </Text>
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};