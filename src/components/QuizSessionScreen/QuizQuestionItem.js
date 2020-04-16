import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { ScrollView } from 'react-native-gesture-handler';
import { ListItemBadge } from '../ListItemBadge';
import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { iOSUIKit } from 'react-native-typography';


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
    scrollview: {
      flex: 1,
    },
    contentContainer: {
      marginHorizontal: 12,
      marginTop: 8,
      marginBottom: 12,
    },
    questionContainer: {
      flexDirection: 'row',
    },
    listItem: {
      position: 'absolute',
      margin: 10,
    },
    textQuestion: {
      ...iOSUIKit.bodyObject,
      color: Colors.GREY[900],
      lineHeight: 23
    },
  });

  render(){
    const { styles } = QuizQuestionItem;
    const { index, ...props } = this.props;

    const questionText = props[QuizQuestionKeys.questionText];

    return(
      <View style={styles.rootContainer}>
        <ScrollView style={styles.scrollview}>
          <ListItemBadge
            size={20}
            value={(index + 1)}
            textStyle={{fontWeight: '900'}}
            color={Colors.BLUE[100]}
            textColor={Colors.BLUE.A700}
            containerStyle={styles.listItem}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.textQuestion}>
              {`      ${questionText}`}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };
};