import React from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import { iOSUIKit     } from 'react-native-typography';
import { VibrancyView } from "@react-native-community/blur";

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import { AnswerMultipleChoice } from 'app/src/components/QuizSessionScreen/AnswerMultipleChoice';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { SectionTypes } from 'app/src/constants/SectionTypes';
import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';



export class QuizQuestionItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'white',
      margin: 10,
      borderRadius: 15,
      // shadow
      shadowColor: "#000",
      shadowOpacity: 0.3,
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

  _renderAnswer(){
    const { styles } = QuizQuestionItem;
    const props = this.props;

    // extract question values from props
    const question = QuizQuestionModel.extract(props);

    const sectionType = props[QuizQuestionKeys.sectionType];
 
    switch (sectionType) {
      case SectionTypes.MATCHING_TYPE:
      case SectionTypes.IDENTIFICATION:
      case SectionTypes.TRUE_OR_FALSE: return null;

      case SectionTypes.MULTIPLE_CHOICE: return (
        <AnswerMultipleChoice
          {...question}
        />
      );
    };
  };

  render(){
    const { styles } = QuizQuestionItem;
    const { index, ...props } = this.props;

    const questionText = props[QuizQuestionKeys.questionText];

    return(
      <View style={styles.rootContainer}>
        <View style={styles.rootWrapper}>
          <ScrollView
            style={styles.scrollview}
            contentContainerStyle={styles.scrollviewContent}
          >
            <ListItemBadge
              size={20}
              value={(index + 1)}
              textStyle={{fontWeight: '900'}}
              color={Colors.BLUE[100]}
              textColor={Colors.BLUE.A700}
              containerStyle={styles.listItemBadge}
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
    );
  };
};