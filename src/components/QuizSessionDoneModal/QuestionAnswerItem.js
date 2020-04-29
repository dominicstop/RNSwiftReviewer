import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import moment  from 'moment';

import { ModalSection    } from 'app/src/components/ModalSection';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { iOSUIKit } from 'react-native-typography';
import { ListItemBadge } from '../ListItemBadge';


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
  });

  render(){
    const { styles } = QuestionAnswerItem;
    const { question, answer, index } = this.props;

    const questionText = question?.[QuizQuestionKeys.questionText] ?? 'N/A';

    return (
      <View style={styles.rootContainer}>
        <View style={styles.questionContainer}>
          <ListItemBadge
            size={20}
            initFontSize={12}
            value={(index + 1)}
            textStyle={{fontWeight: '900'}}
            color={Colors.BLUE[100]}
            textColor={Colors.BLUE.A700}
            containerStyle={styles.itemBadge}
          />
          <Text
            style={styles.textQuestion}
            numberOfLines={3}
          >
            {`       ${questionText}`}
          </Text>
        </View>
      </View>
    );
  };
};