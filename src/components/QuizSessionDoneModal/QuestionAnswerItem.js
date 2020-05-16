import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import moment  from 'moment';
import Ionicon from "@expo/vector-icons/Ionicons";

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import { ListItemBadge } from 'app/src/components/ListItemBadge';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { BORDER_WIDTH } from 'app/src/constants/UIValues';
import { QuizQuestionKeys, QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';

const MODES = {
  'INACTIVE'         : 'INACTIVE',
  'SELECTED'         : 'SELECTED',
  'INACTIVE_BOOKMARK': 'INACTIVE_BOOKMARK',
  'SELECTED_BOOKMARK': 'SELECTED_BOOKMARK',
};


export class QuestionAnswerItem extends React.Component {
  static propTypes = {
  };

  static styles = StyleSheet.create({
    rootContainer: {
      paddingTop: 10,
      paddingHorizontal: 12,
      paddingBottom: 10,
      borderBottomWidth: BORDER_WIDTH,
      borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    contentContainer: {
      flex: 1,
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

  constructor(props){
    super(props);

    const hasBookmark = (props.bookmark != undefined);

    this.state = {
      showBookmarkIcon: hasBookmark,
    };
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    return (
      (prevProps.bookmark         != nextProps.bookmark        ) ||
      (prevState.showBookmarkIcon != nextState.showBookmarkIcon)
    );
  };

  componentDidUpdate(prevProps){
    const nextProps = this.props;

    if(prevProps.bookmark != nextProps.bookmark){
      this.rootContainer.pulse(300);
    };
  };

  getModeFromProps(){
    const { index, currentIndex, bookmark } = this.props;

    const isActive    = (currentIndex == index);
    const hasBookmark = (bookmark != undefined);

    return (
      ( isActive &&  hasBookmark)? MODES.SELECTED_BOOKMARK :
      ( isActive && !hasBookmark)? MODES.SELECTED          :
      (!isActive &&  hasBookmark)? MODES.INACTIVE_BOOKMARK :
      (!isActive && !hasBookmark)? MODES.INACTIVE          : MODES.INACTIVE
    );
  };

  derivePropsFromMode(){
    const mode = this.getModeFromProps();

    switch (mode) {
      case MODES.INACTIVE: return {
        badgeColor    : Colors.BLUE[100],
        badgeTextColor: Colors.BLUE.A700,
        rootContainerStyle: {
          backgroundColor: 'rgba(255,255,255,0.9)',
        },
      };
      case MODES.SELECTED: return {
        badgeColor    : Colors.BLUE.A400,
        badgeTextColor: 'white',
        rootContainerStyle: {
          backgroundColor: Colors.BLUE[50],
        },
      };
      case MODES.INACTIVE_BOOKMARK: return {
        badgeColor    : Colors.ORANGE[100],
        badgeTextColor: Colors.ORANGE.A700,
        rootContainerStyle: {
          backgroundColor: Colors.ORANGE[50],
        },
      };
      case MODES.SELECTED_BOOKMARK: return {
        badgeColor    : Colors.BLUE.A400,
        badgeTextColor: 'white',
        rootContainerStyle: {
          backgroundColor: Colors.BLUE[50],
        },
      };
    };
  };

  _handleOnPress = () => {
    const { onPressQuestion, ...props } = this.props;
    
    this.rootContainer.pulse(300);
    onPressQuestion && onPressQuestion({
      index   : props.index   ,
      answer  : props.answer  ,
      question: props.question,
    });
  };

  _handleOnLongPress = () => {
    const { onLongPressQuestion, ...props } = this.props;

    onLongPressQuestion && onLongPressQuestion({
      index   : props.index   ,
      answer  : props.answer  ,
      question: props.question,
      bookmark: props.bookmark,
    });
  };

  render(){
    const { styles } = QuestionAnswerItem;
    const { index, question, answer } = this.props;
    
    const hasAnswer = (answer != undefined);
    const modeProps = this.derivePropsFromMode();

    const questionText = question?.[QuizQuestionKeys.questionText] ?? 'N/A';

    const answerValue = answer?.[QuizSessionAnswerKeys.answerValue    ] ?? 'N/A';
    const answerTime  = answer?.[QuizSessionAnswerKeys.answerTimestamp] ?? 0;

    const dateAnswerTime = moment.unix(answerTime / 1000);
    const textAnswerTime = dateAnswerTime.format('hh:mm');

    return (
      <Animatable.View
        ref={r => this.rootContainer = r}
        style={[styles.rootContainer, modeProps.rootContainerStyle]}
        useNativeDriver={true}
      >
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={this._handleOnPress}
          onLongPress={this._handleOnLongPress}
          activeOpacity={0.5}
        >
          <View style={styles.questionContainer}>
            <ListItemBadge
              size={20}
              initFontSize={12}
              value={(index + 1)}
              textStyle={{fontWeight: '900'}}
              containerStyle={styles.itemBadge}
              color={modeProps.badgeColor}
              textColor={modeProps.badgeTextColor}
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