import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import moment         from 'moment';
import Feather        from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import { iOSUIKit, sanFranciscoWeights } from 'react-native-typography';

import { ModalSection    } from 'app/src/components/Modal/ModalSection';
import { ListItemBadge   } from 'app/src/components//ListItemBadge';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { QuizSessionKeys, QuizSessionScoreKeys } from 'app/src/constants/PropKeys';
import { LabelPill } from '../LabelPill';

const BAR_HEIGHT = 12;

const { width: screenWidth } = Dimensions.get('screen');

class ScoreBar extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      opacity: 0.75,
      marginTop: 5,
      height: BAR_HEIGHT,
      borderRadius: BAR_HEIGHT/2,
      paddingVertical: 1.5,
      paddingHorizontal: 2,
      borderColor: Colors.BLUE.A700,
      borderWidth: 1,
    },
    scoreBarContainer: {
      height: '100%',
      borderRadius: BAR_HEIGHT/2,
      overflow: 'hidden',
    },
    scoreBar: {
      position: 'absolute', 
      height: '100%',
      width: screenWidth - 10, 
    },
  });

  render(){
    const { styles } = ScoreBar;
    const { scorePercent } = this.props;

    const scoreBarContainerStyle = {
      width: ((scorePercent < BAR_HEIGHT)
        ? BAR_HEIGHT 
        : `${scorePercent}%`
      ),
    };

    return(
      <View style={styles.rootContainer}>
        <View style={[styles.scoreBarContainer, scoreBarContainerStyle]}>
          <LinearGradient
            style={styles.scoreBar}
            colors={[Colors.BLUE.A700, Colors.BLUE.A700]}
            start={{ x: 0, y: 1 }}
            end  ={{ x: 1, y: 1 }}
          />
        </View>
      </View>
    );
  };
};

export class  ViewQuizSessionItem extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderBottomWidth: BORDER_WIDTH,
      borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    rootContainerEmpty: {
      paddingVertical: 25,
      paddingHorizontal: 13,
    },
    titleScoreContainer: {
      flexDirection: 'row',
    },
    textDateTitle: {
      ...iOSUIKit.subheadObject,
      ...sanFranciscoWeights.bold,
      fontSize: (iOSUIKit.subheadEmphasizedObject.fontSize + 2),
      marginLeft: 8,
      color: Colors.BLUE.A700,
    },
    titleSubtitleContainer: {
      flex: 1,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    scoreContainer: {
      aspectRatio: 1,
      width: 42,
      borderRadius: 42/2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
    },
    textPercent: {
      ...iOSUIKit.footnoteEmphasizedWhiteObject,
      ...sanFranciscoWeights.heavy,
    },
    subtitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    textSubtitle: {
      ...iOSUIKit.subheadObject,
      marginLeft: 5,
    },
    textLabelSubtitle: {
      ...sanFranciscoWeights.semibold,
      color: Colors.BLUE[1000],
    },
    textSubtitleFromNow: {
      color: Colors.GREY[800],
    },
    textSubtitleTime: {
      ...iOSUIKit.footnoteObject,
      ...sanFranciscoWeights.light,
      color: Colors.GREY[600],
    },
    detailTableContainer: {
      marginVertical: 3
    },
  });

  _renderEmpty(){
    const { styles } =  ViewQuizSessionItem;

    return (
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
    );
  };

  _renderSession(){
    const { styles } =  ViewQuizSessionItem;
    const { session, index } = this.props;

    const scores    = session?.[QuizSessionKeys.sessionScore    ] ?? 0;
    const dateStart = session?.[QuizSessionKeys.sessionDateStart] ?? 0;
    const dateEnd   = session?.[QuizSessionKeys.sessionDateEnd  ] ?? 0;
    const duration  = session?.[QuizSessionKeys.sessionDuration ] ?? 0;

    const dateEndMoment  = moment.unix(dateEnd / 1000);
    const dateEndFormat  = dateEndMoment.format('MMMM DD dddd, YYYY');
    const timeEndFormat  = dateEndMoment.format('hh:mm A');
    const dateEndFromNow = dateEndMoment.fromNow();

    const textDuration = Helpers.formatMsToDuration(duration);

    const totalItems     = scores?.[QuizSessionScoreKeys.scoreTotalItems    ] ?? null;
    const percentCorrect = scores?.[QuizSessionScoreKeys.scorePercentCorrect] ?? null;
    
    const scoreWrong   = scores?.[QuizSessionScoreKeys.scoreWrong     ] ?? null;
    const scoreCorrect = scores?.[QuizSessionScoreKeys.scoreCorrect   ] ?? null;
    const scoreSkipped = scores?.[QuizSessionScoreKeys.scoreUnanswered] ?? null;

    const textPercentCorrect = percentCorrect? `${Math.trunc(percentCorrect)}%` : 'N/A' ;

    const textScoreWrong   = (scoreWrong   != null)? `${scoreWrong  } ${Helpers.plural('item', scoreWrong  )}`: 'N/A' ;
    const textScoreSkipped = (scoreSkipped != null)? `${scoreSkipped} ${Helpers.plural('item', scoreSkipped)}`: 'N/A' ;
    
    const textScoreCorrect = (scoreCorrect != null)? `${scoreCorrect}/${totalItems}`: 'N/A' ;

    const scoreContainerStyle = {
      backgroundColor: (
        (percentCorrect <  25                         )? Colors.RED   .A700 :
        (percentCorrect >= 25 && percentCorrect <  50 )? Colors.ORANGE.A700 :
        (percentCorrect >= 50 && percentCorrect <  75 )? Colors.YELLOW.A700 :
        (percentCorrect >= 75 && percentCorrect <= 100)? Colors.GREEN .A700 : Colors.GREY[700]
      ),
    };

    return (
      <View style={styles.rootContainer}>
        <View style={styles.titleScoreContainer}>
          <View style={styles.titleSubtitleContainer}>
            <View style={styles.titleContainer}>
              <ListItemBadge
                size={19}
                initFontSize={12}
                value={(index + 1)}
                textStyle={{fontWeight: '900'}}
                color={Colors.BLUE[100]}
                textColor={Colors.BLUE.A700}
              />
              <Text style={styles.textDateTitle}>
                {dateEndFormat}
              </Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Feather
                style={{opacity: 0.75}}
                name={'clock'}
                size={16}
                color={Colors.BLUE[1000]}
              />
              <Text style={styles.textSubtitle}>
                <Text style={styles.textLabelSubtitle}>
                  {'Taken: '}
                </Text>
                <Text style={styles.textSubtitleFromNow}>
                  {dateEndFromNow}
                </Text>
                <Text style={styles.textSubtitleTime}>
                  {` (at ${timeEndFormat})`}
                </Text>
              </Text>
            </View>
          </View>
          <View style={[styles.scoreContainer, scoreContainerStyle]}>
            <Text 
              style={styles.textPercent}
              numberOfLines={1}
            >
              {textPercentCorrect}
            </Text>
          </View>
        </View>
        <TableLabelValue
          containerStyle={styles.detailTableContainer}
          labelValueMap={[
            ['Score:' , textScoreCorrect],
            ['Wrong:'   , textScoreWrong  ],
            ['Skipped:' , textScoreSkipped],
            ['Duration:', textDuration    ],
          ]}
        />
        <ScoreBar
          scorePercent={percentCorrect}
        />
      </View>
    );
  };

  render(){
    const { isEmpty } = this.props;

    return (isEmpty
      ? this._renderEmpty()
      : this._renderSession()
    );
  };
};