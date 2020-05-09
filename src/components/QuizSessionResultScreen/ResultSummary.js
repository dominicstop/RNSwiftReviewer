import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Pie        from 'react-native-pie';
import Ionicon    from '@expo/vector-icons/Ionicons';
import Reanimated from 'react-native-reanimated';

import { Easing } from 'react-native-reanimated';
import { iOSUIKit, sanFranciscoWeights } from 'react-native-typography';
import { Divider } from 'react-native-elements';

import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';
import { HeaderValues } from 'app/src/constants/HeaderValues';
import { SNPQuizSessionResult } from 'app/src/constants/NavParams';
import { QuizSessionKeys, QuizSessionScoreKeys } from 'app/src/constants/PropKeys';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

const { Value, Extrapolate, timing, concat, interpolate, set, cond, block, and, or, onChange, eq, call, Clock, clockRunning, startClock, stopClock, debug, divide, multiply } = Reanimated;


const CHART_SIZE = 70;

const MODES = {
  DEFAULT   : 'DEFAULT'   ,
  WRONG     : 'WRONG'     ,
  CORRECT   : 'CORRECT'   ,
  UNANSWERED: 'UNANSWERED',
};


class OptionButton extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 15,
    },
    textLabel: {
      ...iOSUIKit.subheadObject,
      ...sanFranciscoWeights.bold,
      marginLeft: 7,
      width: 60,
    },
    textScore: {
      ...iOSUIKit.subheadObject,
      ...sanFranciscoWeights.black,
      textAlign: 'center',
      marginLeft: 3,
    },
  });

  static getValues(value, scores){
    const scoreWrong   = scores[QuizSessionScoreKeys.scoreWrong];
    const scoreCorrect = scores[QuizSessionScoreKeys.scoreCorrect];
    const scoreSkipped = scores[QuizSessionScoreKeys.scoreUnanswered];

    switch (value) {
      case MODES.WRONG: return {
        iconName : 'ios-close-circle',
        textLabel: 'Wrong',
        textScore: scoreWrong,
        // colors
        colorBgActive     : Colors.RED.A700,
        colorBgInactive   : Colors.RED[50] ,
        colorIconActive   : 'white',
        colorIconInactive : Colors.RED.A700,
        colorLabelActive  : 'white',
        colorLabelInactive: Colors.RED[900],
        colorScoreActive  : 'white',
        colorScoreInactive: Colors.RED.A700,
      };
      case MODES.CORRECT: return {
        iconName : 'ios-checkmark-circle',
        textLabel: 'Correct',
        textScore: scoreCorrect,
        // colors
        colorBgActive     : Colors.GREEN.A700,
        colorBgInactive   : Colors.GREEN[50] ,
        colorIconActive   : 'white',
        colorIconInactive : Colors.GREEN.A700,
        colorLabelActive  : 'white',
        colorLabelInactive: Colors.GREEN[500],
        colorScoreActive  : 'white',
        colorScoreInactive: Colors.GREEN.A700,
      };
      case MODES.UNANSWERED: return {
        iconName: 'ios-help-circle',
        textLabel: 'Skipped',
        textScore: scoreSkipped,
        // colors
        colorBgActive     : Colors.BLUE_GREY[500],
        colorBgInactive   : Colors.BLUE_GREY[50],
        colorIconActive   : 'white',
        colorIconInactive : Colors.BLUE_GREY[500],
        colorLabelActive  : 'white',
        colorLabelInactive: Colors.BLUE_GREY[900],
        colorScoreActive  : 'white',
        colorScoreInactive: Colors.BLUE_GREY[900],

      };
    };
  };

  constructor(props){
    super(props);
    const { scores } = props;

    const max = Math.max(...[
      scores?.[QuizSessionScoreKeys.scoreWrong     ] ?? 0,
      scores?.[QuizSessionScoreKeys.scoreCorrect   ] ?? 0,
      scores?.[QuizSessionScoreKeys.scoreUnanswered] ?? 0
    ]);

    const digits = (max?.toString()?.length ?? 0);
    this.textScoreWidth = (digits * 20);
  };

  shouldComponentUpdate(nextProps){
    const prevProps = this.props;

    return(
      prevProps.mode  != nextProps.mode  ||
      prevProps.value != nextProps.value 
    );
  };

  _handleOnPress = () => {
    const { onPress, value } = this.props;
    this.rootContainerRef.pulse(500);
    onPress && onPress(value);
  };

  render(){
    const { styles, getValues } = OptionButton;
    const { value, scores, mode } = this.props;

    const values = getValues(value, scores);

    const isSelected = (value == mode);

    const rootContainerStyle = {
      backgroundColor: (isSelected
        ? values.colorBgActive
        : values.colorBgInactive
      ),
    };

    const textLabelStyle = {
      color: (isSelected
        ? values.colorLabelActive
        : values.colorLabelInactive
      ),
    };

    const textScoreStyle = {
      width: this.textScoreWidth,
      color: (isSelected
        ? values.colorScoreActive
        : values.colorScoreInactive
      ),
    };

    return(
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <TouchableOpacity
          style={[styles.rootContainer, rootContainerStyle]}
          activeOpacity={0.75}
          onPress={this._handleOnPress}
        >
          <Ionicon
            name={values.iconName}
            size={20}
            color={(isSelected
              ? values.colorIconActive
              : values.colorIconInactive
            )}
          />
          <Text style={[styles.textLabel, textLabelStyle]}>
            {values.textLabel}
          </Text>
          <Text style={[styles.textScore, textScoreStyle]}>
            {values.textScore}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};

class ScorePieChart extends React.Component {
  static styles = StyleSheet.create({
    chartButtonsContainer: {
      flexDirection: 'row',
    },
    chartWrapper: {
      aspectRatio: 1,
      width: CHART_SIZE * 2,
    },
    scoreContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textScoreLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      color: Colors.GREY[800]
    },
    textScore: {
      ...iOSUIKit.bodyEmphasizedObject,
      ...sanFranciscoWeights.heavy,
    },
    inidicatorContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      marginTop: 37,
    },
    inidicator: {
      aspectRatio: 1,
      width: 12,
      borderRadius: 12/2,
      backgroundColor: 'red',
    },
  });

  static runTiming(clock) {
    const state = {
      time     : new Value(0),
      finished : new Value(0),
      position : new Value(0),
      frameTime: new Value(0),
    };

    const config = {
      duration: new Value(1000 * 90),
      toValue : new Value(100),
      easing  : Easing.linear,
    };

    return block([
      // start right away
      startClock(clock),

      // process your state
      timing(clock, state, config),

      // when over (processed by timing at the end)
      cond(state.finished, [
        // set flag ready to be restarted
        set(state.finished, 0),
        // same value as the initial defined in the state creation
        set(state.position, 0),

        // very important to reset this ones !!! as mentioned in the doc about timing is saying
        set(state.time, 0),
        set(state.frameTime, 0),
      ]),

      // return position
      state.position,
    ]);
  };

  constructor(props){
    super(props);

    this.state = {
      showPercent: false,
    };

    const clock = new Clock();
    const progress = ScorePieChart.runTiming(clock);

    this.rotate = Reanimated.interpolate(progress, {
      inputRange : [0, 100],
      outputRange: [0, 360],
      extrapolate: Extrapolate.CLAMP,
    });
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    return(
      prevProps.mode        != nextProps.mode        ||
      prevState.showPercent != nextState.showPercent 
    );
  };

  componentDidUpdate(prevProps){
    const nextProps = this.props;

    if(prevProps.mode != nextProps.mode){
      this.rootContainerRef.pulse(300);
    };
  };

  getPropsFromMode(){
    const { session, mode } = this.props;

    const scores = session[QuizSessionKeys.sessionScore];

    const totalItems   = scores[QuizSessionScoreKeys.scoreTotalItems];
    const scoreWrong   = scores[QuizSessionScoreKeys.scoreWrong];
    const scoreCorrect = scores[QuizSessionScoreKeys.scoreCorrect];
    const scoreSkipped = scores[QuizSessionScoreKeys.scoreUnanswered];

    const percentWrong      = scores[QuizSessionScoreKeys.scorePercentWrong];
    const percentCorrect    = scores[QuizSessionScoreKeys.scorePercentCorrect];
    const percentUnanswered = scores[QuizSessionScoreKeys.scorePercentUnanswered];

    switch (mode) {
      case MODES.DEFAULT: return {
        textScore   : `${scoreCorrect}/${totalItems}`,
        scorePercent: `${Helpers.roundToTwo(percentCorrect)}%`,

        colorIndicator: null,
        sections: [
          { percentage: percentWrong     , color: Colors.RED      .A700 },
          { percentage: percentCorrect   , color: Colors.GREEN    .A700 },
          { percentage: percentUnanswered, color: Colors.BLUE_GREY[500] },
        ],
      };
      case MODES.CORRECT: return {
        textScore     : `${scoreCorrect}/${totalItems}`,
        scorePercent  : `${Helpers.roundToTwo(percentCorrect)}%`,
        colorIndicator: Colors.GREEN.A700,
        sections: [
          { percentage: percentWrong     , color: Colors.RED      [100] },
          { percentage: percentCorrect   , color: Colors.GREEN    .A700 },
          { percentage: percentUnanswered, color: Colors.BLUE_GREY[100] },
        ],
      };
      case MODES.WRONG: return {
        textScore     : `${scoreWrong}/${totalItems}`,
        scorePercent  : `${Helpers.roundToTwo(percentWrong)}%`,
        colorIndicator: Colors.RED.A700,
        sections: [
          { percentage: percentWrong     , color: Colors.RED      .A700 },
          { percentage: percentCorrect   , color: Colors.GREEN    [100] },
          { percentage: percentUnanswered, color: Colors.BLUE_GREY[100] },
        ],
      };
      case MODES.UNANSWERED: return {
        textScore     : `${scoreSkipped}/${totalItems}`,
        scorePercent  : `${Helpers.roundToTwo(percentUnanswered)}%`,
        colorIndicator: Colors.BLUE_GREY[500],
        sections: [
          { percentage: percentWrong     , color: Colors.RED      [100] },
          { percentage: percentCorrect   , color: Colors.GREEN    [100] },
          { percentage: percentUnanswered, color: Colors.BLUE_GREY[500] },
        ],
      };
    };
  };

  _handleOnPress = () => {
    this.textScoreRef     && this.textScoreRef    .pulse(500);
    this.rootContainerRef && this.rootContainerRef.pulse(300);

    this.setState((prevState) => ({
      showPercent: !prevState.showPercent,
    }));
  };

  render(){
    const { styles } = ScorePieChart;
    const { session, mode } = this.props;
    const { showPercent } = this.state;

    const modeProps    = this.getPropsFromMode();
    const noneSelected = (mode === MODES.DEFAULT);

    const chartWrapper = {
      transform: [
        { rotate: concat(this.rotate, 'deg') }
      ],
    };

    const textScoreStyle = {
      ...(!noneSelected && {
        ...sanFranciscoWeights.heavy,
      })
    };

    return (
      <Animatable.View 
        style={styles.rootContainer}
        ref={r => this.rootContainerRef = r}
        animation={'fadeIn'}
        duration={1000}
        delay={500}
        useNativeDriver={true}
      >
        <TouchableOpacity
          onPress={this._handleOnPress}
          activeOpacity={0.75}
        >
          <View style={styles.scoreContainer}>
            <Animatable.Text
              ref={r => this.textScoreRef = r}
              style={[styles.textScore, textScoreStyle]}
              useNativeDriver={true}
            >
              {(showPercent
                ? modeProps.scorePercent
                : modeProps.textScore
              )}
            </Animatable.Text>
          </View>
          <View style={styles.inidicatorContainer}>
            {noneSelected?(
              <Text style={styles.textScoreLabel}>
                {'Score'}
              </Text>
            ):(
              <Animatable.View 
                style={[styles.inidicator, { backgroundColor: modeProps.colorIndicator }]}
                animation={'breathe'}
                duration={4000}
                iterationDelay={1000}
                iterationCount={'infinite'}
                useNativeDriver={true}
              />
            )}
          </View>
          <Reanimated.View style={[styles.chartWrapper, chartWrapper]}>
            <Pie
              radius={CHART_SIZE}
              innerRadius={50}
              sections={modeProps.sections}
            />
          </Reanimated.View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};

class SummaryDecription extends React.Component {
  static styles = StyleSheet.create({

  });

  getDescription(){
    const { scores } = this.props;

    const totalItems   = scores[QuizSessionScoreKeys.scoreTotalItems];
    const scoreCorrect = scores[QuizSessionScoreKeys.scoreCorrect];

    const percentCorrect = scores[QuizSessionScoreKeys.scorePercentCorrect];
    const percentSkipped = scores[QuizSessionScoreKeys.scorePercentUnanswered];

    const passingGrade = Math.ceil(totalItems / 2);

    const itemsNeededToPass = (passingGrade - scoreCorrect);
    const itemsAbovePassing = (scoreCorrect - passingGrade);

    const didPass = (percentCorrect >= 50);

    if     (scoreCorrect   == passingGrade) return "Woah, it looks like you have exactly enough points to pass. Good job!";
    else if(percentCorrect == 100         ) return "Wow, looks like you have a perfect score! Congratulations, you did great!";
    else if(percentSkipped == 100         ) return "Whoops, it looks like you skipped all of the questions. Try answering some questions!";
    else if(percentCorrect == 0           ) return "Oops, looks like you got every question wrong? Don't worry, you just need to keep practicing.";
    else if(percentCorrect <  50          ) return `You needed ${itemsNeededToPass} ${plural('item', itemsNeededToPass)} more to pass. Your score is ${scoreCorrect}/${totalItems}. The passing score is ${passingGrade} ${plural('item', passingGrade)}.`;
    else if(percentCorrect >  50          ) return `The passing score is ${passingGrade} ${plural('item', passingGrade)} and you scored ${scoreCorrect}/${totalItems}. You're ${itemsAbovePassing} ${plural('item', itemsAbovePassing)} above the passing score. `;
  };

  render(){
    const { scores } = this.props;
    const percentCorrect = scores[QuizSessionScoreKeys.scorePercentCorrect];

    const didPass = (percentCorrect >= 50);
    const title  = (didPass? 'You Passed' : 'You Failed');

    const subtitle = this.getDescription();
    

    return(
      <ImageTitleSubtitle
        imageSource={require('app/assets/icons/e-calc.png')}
        imageSize={80}
        hasPadding={false}
        {...{title, subtitle}}
      />
    );
  };
};

export class ResultSummary extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: 'white',
      padding: 15,
    },
    chartButtonsContainer: {
      flexDirection: 'row',
      marginRight: 10,
    },
    buttonsContainer: {
      flex: 1,
      marginRight: 10,
      justifyContent: 'space-around'
    },
  });

  constructor(props){
    super(props);

    this.state = {
      mode: MODES.DEFAULT,
    };
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    return(
      prevState.mode != nextState.mode 
    );
  };

  _handleOnPressOption = (value) => {
    const { mode } = this.state;
    const selected = (value == mode);

    this.setState({
      mode: (selected? MODES.DEFAULT : value)
    });
  };

  render(){
    const { styles } = ResultSummary;
    const { session } = this.props;
    const { mode } = this.state;

    const scores = session[QuizSessionKeys.sessionScore];

    return (
      <View style={styles.rootContainer}>
        <SummaryDecription
          {...{scores}}
        />
        <Divider style={{margin: 20}}/>
        <View style={styles.chartButtonsContainer}>
          <View style={styles.buttonsContainer}>
            <OptionButton
              value={MODES.CORRECT}
              onPress={this._handleOnPressOption}
              {...{scores, mode}}
            />
            <OptionButton
              value={MODES.WRONG}
              onPress={this._handleOnPressOption}
              {...{scores, mode}}
            />
            <OptionButton
              value={MODES.UNANSWERED}
              onPress={this._handleOnPressOption}
              {...{scores, mode}}
            />
          </View>
          <ScorePieChart
            {...{session, mode}}
          />
        </View>
      </View>
    );
  };
};