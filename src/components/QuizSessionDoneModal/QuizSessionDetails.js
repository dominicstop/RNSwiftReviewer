import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import Feather from '@expo/vector-icons/Feather';
import moment  from 'moment';

import { Divider } from 'react-native-elements';

import { iOSUIKit, sanFranciscoWeights } from 'react-native-typography';

import { ModalSection    } from 'app/src/components/Modal/ModalSection';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizKeys, QuizSessionKeys } from 'app/src/constants/PropKeys';
import { DetailPill } from '../DetailPill';
import { TimeElasped } from '../TimeElapsed';



export class QuizSessionDetails extends React.Component {
  static propTypes = {
    title   : PropTypes.string,
    subtitle: PropTypes.string,
    //options
    help        : PropTypes.bool,
    helpTitle   : PropTypes.string,
    helpSubtitle: PropTypes.string,
    disableGlow : PropTypes.bool,
    //styles
    titleStyle   : PropTypes.object,
    subtitleStyle: PropTypes.object,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      paddingHorizontal: 15,
    },
    detailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailPill: {
      flex: 1,
    },
    textTime: {
      fontVariant: ['tabular-nums'],
    },
  });

  constructor(props){
    super(props);

    const answers = Object.keys(props.answers);

    this.state = {
      questionCount: props?.questions?.length ?? 0,
      answerCount  : answers.length,
    };
  };


  render(){
    const { styles } = QuizSessionDetails;
    const { session } = this.props;
    const { questionCount, answerCount } = this.state;

    const sessionDateStart = session[QuizSessionKeys.sessionDateStart];
    
    const dateStartTime = moment.unix(sessionDateStart / 1000);
    const textStartTime = dateStartTime.format('hh:mm A');

    const remaining = (questionCount - answerCount);

    return(
      <ModalSection
        containerStyle={styles.rootContainer}
        showBorderTop={false}
        hasMarginBottom={false}
      >
        <View style={styles.detailsContainer}>
          <DetailPill
            title={'Start Time:'}
            subtitle={textStartTime}
            help={true}
            helpTitle={'Started'}
            helpSubtitle={'Tells you what time the quiz began.'}
            containerStyle={styles.detailPill}
          />
          <DetailPill
            title={'Elapsed Time:'}
            help={true}
            helpTitle={'Elapsed'}
            helpSubtitle={'Tells you how much time has elapsed.'}
            subtitleStyle={styles.textTime}
            containerStyle={styles.detailPill}
          >
            <TimeElasped startTime={sessionDateStart}/>
          </DetailPill>
        </View>
        <View style={[styles.detailsContainer, { marginTop: 15 }]}>
          <DetailPill
            title={'Progress: '}
            subtitle={`${answerCount} / ${questionCount} Items`}
            help={true}
            helpTitle={'Progress'}
            helpSubtitle={'Shows how many questions you have answered over the total questions in this quiz.'}
            containerStyle={styles.detailPill}
          />
          <DetailPill
            title={'Remaining: '}
            subtitle={`${remaining} ${Helpers.plural('Question', answerCount)}`}
            help={true}
            helpTitle={'Remaining Questions'}
            helpSubtitle={'Shows how many questions are left for this quiz.'}
            containerStyle={styles.detailPill}
          />
        </View>
      </ModalSection>
    );
  };
};