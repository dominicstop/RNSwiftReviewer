import React from 'react';
import { StyleSheet, ScrollView, TouchableWithoutFeedback, Text, View } from 'react-native';

import { iOSUIKit     } from 'react-native-typography';
import { VibrancyView } from "@react-native-community/blur";

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import { AnswerTrueOrFalse    } from 'app/src/components/QuizSessionScreen/AnswerTrueOrFalse';
import { AnswerMatchingType   } from 'app/src/components/QuizSessionScreen/AnswerMatchingType';
import { AnswerMultipleChoice } from 'app/src/components/QuizSessionScreen/AnswerMultipleChoice';
import { AnswerIdentification } from 'app/src/components/QuizSessionScreen/AnswerIdentification';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { SectionTypes     } from 'app/src/constants/SectionTypes';
import { QuizQuestionKeys, QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';


export class QuizQuestionItem extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'white',
      margin: 10,
      borderRadius: 15,
      // shadow
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowOpacity: 1,
      shadowRadius: 3.84,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    rootWrapper: {
      flex: 1,
      borderRadius: 15,
      overflow: 'hidden',
      marginTop: 8,
    },
    scrollview: {
      flex: 1,
    },
    scrollviewContent: {
      paddingBottom: 200,
    },
    contentContainer: {
      marginHorizontal: 12,
      marginBottom: 12,
    },
    questionContainer: {
      flexDirection: 'row',
    },
    listItemBadge: {
      position: 'absolute',
      marginLeft: 10,
      marginTop: 1,
    },
    textQuestion: {
      ...iOSUIKit.bodyObject,
      color: Colors.GREY[900],
      lineHeight: 23
    },
    answerContainer: {
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      // float bottom
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    answerBackgroundBlur: {
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      ...StyleSheet.absoluteFillObject,
    },
  });

  constructor(props){
    super(props);

    this.state = {
      extraBottomSpace: 0,
    };
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    const prevAns = prevProps.answer ?? {};
    const nextAns = nextProps.answer ?? {};

    const prevAnsVal = prevAns[QuizSessionAnswerKeys.answerValue];
    const nextAnsVal = nextAns[QuizSessionAnswerKeys.answerValue];

    return(
      // update when bottomSpace changes
      prevState.extraBottomSpace != nextState.extraBottomSpace ||
      // update when focused
      prevProps.isFocused != nextProps.isFocused ||
      // update when bookmark changes
      prevProps.bookmark != nextProps.bookmark ||
      // update when the answer changed
      prevAnsVal != nextAnsVal
    );
  };

  // this is triggered from QuizSessionScreen
  _onKeyboardWillShowHide = (event, visible) => {
    const { height } = event.endCoordinates;

    this.setState({ 
      extraBottomSpace: (visible? height : 0)
    });
    
    if(this.answerIdentificationRef){
      this.answerIdentificationRef
        ._onKeyboardWillShowHide(event, visible);
    };
  };

  _handleOnLongPress = () => {
    const { onLongPress, index, question } = this.props;
    onLongPress && onLongPress({index, question});
  };

  _renderAnswer(){
    const { question, ...props } = this.props;
    const sectionType = question[QuizQuestionKeys.sectionType];

    const sharedProps = {
      answer   : props.answer   ,
      bookmark : props.bookmark ,
      isFocused: props.isFocused,
      ...question,
    };
    
    switch (sectionType) {
      case SectionTypes.MATCHING_TYPE: return (
        <AnswerMatchingType
          onPressChooseAnswer={props.onPressChooseAnswer}
          {...sharedProps}
        />
      );
      case SectionTypes.TRUE_OR_FALSE: return (
        <AnswerTrueOrFalse
          onAnswerSelected={props.onAnswerSelected}
          {...sharedProps}
        />
      );
      case SectionTypes.IDENTIFICATION: return (
        <AnswerIdentification
          ref={r => this.answerIdentificationRef = r}
          onAnswerSelected={props.onAnswerSelected}
          {...sharedProps}
        />
      );
      case SectionTypes.MULTIPLE_CHOICE: return (
        <AnswerMultipleChoice
          onAnswerSelected={props.onAnswerSelected}
          {...sharedProps}
        />
      );
    };
  };

  render(){
    const { styles } = QuizQuestionItem;
    const { index, question, bookmark } = this.props;
    const { extraBottomSpace } = this.state;

    const sectionType  = question[QuizQuestionKeys.sectionType];
    const questionText = question[QuizQuestionKeys.questionText];

    const choices      = question[QuizQuestionKeys.questionChoices];
    const choicesCount = choices?.length ?? 0;

    const isBookmarked = (
      (bookmark != null     ) ||
      (bookmark != undefined)
    );

    const listItemBadgeProps = (isBookmarked? {
      color    : Colors.ORANGE[100],
      textColor: Colors.ORANGE.A700,
    }:{
      color    : Colors.BLUE[100],
      textColor: Colors.BLUE.A700,
    });

    const bottomSpace = (
      (sectionType == SectionTypes.MATCHING_TYPE  )? 100 : //todo
      (sectionType == SectionTypes.TRUE_OR_FALSE  )? 200 : //todo
      (sectionType == SectionTypes.IDENTIFICATION )? (extraBottomSpace + 100) :
      (sectionType == SectionTypes.MULTIPLE_CHOICE)? (choicesCount * 40) : 0
    );

    return(
      <TouchableWithoutFeedback onLongPress={this._handleOnLongPress}>
        <View style={styles.rootContainer}>
          <View style={styles.rootWrapper}>
            <ScrollView
              style={styles.scrollview}
              contentContainerStyle={{paddingBottom: bottomSpace}}
              showsVerticalScrollIndicator={false}
            >
              <ListItemBadge
                size={20}
                value={(index + 1)}
                textStyle={{fontWeight: '900'}}
                containerStyle={styles.listItemBadge}
                {...listItemBadgeProps}
              />
              <View style={styles.contentContainer}>
                <Text style={styles.textQuestion}>
                  {`      ${questionText}`}
                </Text>
              </View>
            </ScrollView>
            <View style={styles.answerContainer}>
              <VibrancyView
                style={styles.answerBackgroundBlur}
                blurType={"light"}
                intensity={100}
              />
              {this._renderAnswer()}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
};