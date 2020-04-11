import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import moment  from 'moment';

import { Divider } from 'react-native-elements';

import { iOSUIKit, sanFranciscoWeights } from 'react-native-typography';

import { ModalSection    } from 'app/src/components/ModalSection';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizKeys } from 'app/src/constants/PropKeys';


class QuizHeading extends React.PureComponent {
  static styles = StyleSheet.create({
    dateCreatedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 1,
    },
    textTitle: {
      ...iOSUIKit.title3EmphasizedObject,
      ...sanFranciscoWeights.heavy,
      color: Colors.BLUE.A700,
    },
    textDateCreatedRoot: {
      flex: 1,
      marginLeft: 4,
    },
    textDateCreatedLabel: {
      ...iOSUIKit.subheadObject,
      ...sanFranciscoWeights.semibold,
      color: Colors.GREY[800],
    },
    textDateCreated: {
      ...iOSUIKit.subheadObject,
      ...sanFranciscoWeights.regular,
      color: Colors.GREY[800],
    },
    textDateCreatedFromNow: {
      ...iOSUIKit.subheadObject,
      ...sanFranciscoWeights.light,
      color: Colors.GREY[700],
    },
  });

  render(){
    const { styles } = QuizHeading;
    const { quiz } = this.props;

    const quizTitle   = quiz?.[QuizKeys.quizTitle      ] ?? 'N/A';
    const dateCreated = quiz?.[QuizKeys.quizDateCreated] ?? 0;

    const dateCreatedMoment  = moment.unix(dateCreated / 1000);
    const dateCreatedFormat  = dateCreatedMoment.format('MMM DD YYYY');
    const dateCreatedFromNow = dateCreatedMoment.fromNow();

    return(
      <View>
        <Text style={styles.textTitle}>
          {quizTitle}
        </Text>
        <View style={styles.dateCreatedContainer}>
          <Feather
            name={'clock'}
            size={14}
            color={Colors.GREY[800]}
          />
          <Text style={styles.textDateCreatedRoot}>
            <Text style={styles.textDateCreatedLabel}>
              {'Created: '}
            </Text>
            <Text style={styles.textDateCreated}>
              {dateCreatedFormat}
            </Text>
            <Text style={styles.textDateCreatedFromNow}>
              {` (${dateCreatedFromNow})`}
            </Text>
          </Text>
        </View>
      </View>
    );
  };
};

export class ViewQuizDetails extends React.PureComponent {
  static styles = StyleSheet.create({
    quizDetailsContainer: {
      marginTop: 10,
    },
    divider: {
      margin: 10,
    },
    textDescription: {
      ...iOSUIKit.bodyObject,
      color: Colors.GREY[800],
    },
    textDescriptionLabel: {
      ...iOSUIKit.bodyEmphasizedObject,
      color: Colors.BLUE[1100]
    },
  });
  
  render(){
    const { styles } = ViewQuizDetails;
    const { quiz } = this.props;

    const quizDesc = quiz[QuizKeys.quizDesc] ?? 'Description N/A';

    const timesTaken    = quiz[QuizKeys.quizTimesTaken   ] ?? 0;
    const sectionCount  = quiz[QuizKeys.quizSectionCount ] ?? 0;
    const questionCount = quiz[QuizKeys.quizQuestionCount] ?? 0;
    const lastTaken     = quiz[QuizKeys.quizDateLastTaken] ?? 0;

    const dateLastTaken = moment.unix(lastTaken / 1000);
    const textLastTaken = (lastTaken
      ? dateLastTaken.fromNow()
      : 'N/A'
    );

    const textTaken     = `${timesTaken   } ${Helpers.plural('time', timesTaken   )}`;
    const textSections  = `${sectionCount } ${Helpers.plural('item', sectionCount )}`;
    const textQuestions = `${questionCount} ${Helpers.plural('item', questionCount)}`;

    return (
      <ModalSection 
        showBorderTop={false}
        hasMarginBottom={false}
      >
        <QuizHeading {...{quiz}}/>
        <TableLabelValue
          containerStyle={styles.quizDetailsContainer}
          textDetailLabelStyle={{ color: Colors.BLUE[1100] }}
          labelValueMap={[
            ['Taken'    , textTaken    ],
            ['Sections' , textSections ],
            ['Last'     , textLastTaken],
            ['Questions', textQuestions],
          ]}
        />
        <Divider style={styles.divider}/>
        <Text 
          style={styles.textDescription}
          numberOfLines={3}
        >
          <Text style={styles.textDescriptionLabel}>
            {'Description: '}
          </Text>
          {quizDesc}
        </Text>
      </ModalSection>
    );
  };
};