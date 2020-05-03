import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';


import moment  from 'moment';
import { iOSUIKit, sanFranciscoWeights } from 'react-native-typography';

import { ModalSection    } from 'app/src/components/ModalSection';
import { ListItemBadge   } from 'app/src/components//ListItemBadge';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { QuizSessionKeys, QuizSessionScoreKeys } from 'app/src/constants/PropKeys';


export class  ViewQuizSessionItem extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderBottomWidth: BORDER_WIDTH,
      borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    rootContainerEmpty: {
      paddingVertical: 25,
      paddingHorizontal: 13,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textTitle: {
      ...iOSUIKit.subheadObject,
      flex: 1,
      marginLeft: 7,
    },
    textTitleDate: {
      ...sanFranciscoWeights.semibold,
      color: Colors.GREY[900],
    },
    textTitleFromNow: {
      color: Colors.GREY[700],
    },
    textTitleTime: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[800],
    },
    detailContainer: {
      flexDirection: 'row',
      marginTop: 8,
      alignItems: 'center',
    },
    scoreContainer: {
      aspectRatio: 1,
      width: 40,
      borderRadius: 50/2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textPercent: {
      ...iOSUIKit.footnoteEmphasizedWhiteObject,
      ...sanFranciscoWeights.heavy,
    },
    detailTableContainer: {
      flex: 1,
      marginLeft: 10,
    },
  });

  render(){
    const { styles } =  ViewQuizSessionItem;
    const { isEmpty, session, index } = this.props;

    const scores    = session?.[QuizSessionKeys.sessionScore    ] ?? 0;
    const dateStart = session?.[QuizSessionKeys.sessionDateStart] ?? 0;
    const dateEnd   = session?.[QuizSessionKeys.sessionDateEnd  ] ?? 0;
    const duration  = session?.[QuizSessionKeys.sessionDuration ] ?? 0;

    const dateEndMoment  = moment.unix(dateEnd / 1000);
    const dateEndFormat  = dateEndMoment.format('MMM D, ddd YYYY');
    const timeEndFormat  = dateEndMoment.format('hh:mm a');
    const dateEndFromNow = dateEndMoment.fromNow();

    const textDuration = Helpers.formatMsToDuration(duration);

    const percentCorrect = scores?.[QuizSessionScoreKeys.scorePercentCorrect] ?? 'N/A';
    const scoreWrong     = scores?.[QuizSessionScoreKeys.scoreWrong         ] ?? 'N/A';
    const scoreCorrect   = scores?.[QuizSessionScoreKeys.scoreCorrect       ] ?? 'N/A';
    const scoreSkipped   = scores?.[QuizSessionScoreKeys.scoreUnanswered    ] ?? 'N/A';

    const scoreContainerStyle = {
      backgroundColor: (
        (percentCorrect <  25                         )? Colors.RED   .A700 :
        (percentCorrect >= 25 && percentCorrect <  50 )? Colors.ORANGE.A700 :
        (percentCorrect >= 50 && percentCorrect <  75 )? Colors.YELLOW.A700 :
        (percentCorrect >= 75 && percentCorrect <= 100)? Colors.GREEN .A700 : Colors.GREY[700]
      ),
    };

    return (isEmpty? (
      <ModalSection
        containerStyle={styles.rootContainerEmpty}
        showBorderTop={false}
        hasMarginBottom={false}
      >
        <ImageTitleSubtitle
          hasPadding={false}
          imageSource={require('app/assets/icons/e-test-tube.png')}
          title={"No Sessions to show"}
          subtitle={"Oops, looks like you haven't taken this quiz yet. You can take this quiz by tapping the \"Start Quiz\" button."}
        />
      </ModalSection>
    ):(
      <View style={styles.rootContainer}>
        <View style={styles.titleContainer}>
          <ListItemBadge
            size={20}
            value={(index + 1)}
            textStyle={{fontWeight: '900'}}
            color={Colors.BLUE[100]}
            textColor={Colors.BLUE.A700}
          />
          <Text style={styles.textTitle}>
            <Text style={styles.textTitleDate}>
              {dateEndFormat}
            </Text>
            <Text style={styles.textTitleFromNow}>
              {`  (${dateEndFromNow})`}
            </Text>
          </Text>
          <Text style={styles.textTitleTime}>
            {timeEndFormat}
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <View style={[styles.scoreContainer, scoreContainerStyle]}>
            <Text style={styles.textPercent}>
              {`${percentCorrect}%`}
            </Text>
          </View>
          <TableLabelValue
            containerStyle={styles.detailTableContainer}
            labelValueMap={[
              ['Correct:' , scoreCorrect],
              ['Wrong:'   , scoreWrong  ],
              ['Skipped:' , scoreSkipped],
              ['Duration:', textDuration],
            ]}
          />
        </View>
      </View>
    ));
  };
};