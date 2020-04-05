import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';

import * as Animatable from 'react-native-animatable';

import debounce   from 'lodash/debounce';
import Swipeable  from 'react-native-gesture-handler/Swipeable';
import Reanimated from 'react-native-reanimated';

import { Easing     } from 'react-native-reanimated';
import { iOSUIKit   } from 'react-native-typography'; 
import { RectButton } from 'react-native-gesture-handler';

import { ModalSection } from 'app/src/components/ModalSection';

import { QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { SectionTypes } from 'app/src/constants/SectionTypes';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

const { Value, interpolate, timing } = Reanimated;

const ITEM_WIDTH = 100;


// used in modals/QuizAddQuestionModal
// renderItem component, question item
export class QuizAddQuestionModalItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingTop: 7,
      paddingBottom: 7,
      paddingHorizontal: 12,
    },
    actionContainer: {
      width: ITEM_WIDTH,
      flexDirection: 'row',
    },
    rightAction: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: {
      ...iOSUIKit.subheadEmphasizedObject,
      color: 'white',
      padding: 10,
    },
    textQuestionIndicator: {
      ...iOSUIKit.subheadEmphasizedObject,
      fontWeight: '700',
      color: Colors.BLUE.A700,
    },
    textQuestionBody: {
      ...iOSUIKit.subheadObject,
    },
    textAnswer: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[800],
    },
    textAnswerLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      color: Colors.BLUE[1100],
      fontWeight: '600',
    },
  });

  constructor(props){
    super(props);

    const progress = new Value(0);
    this.containerHeight = new Value(1);

    this._rootContainerOpacity = interpolate(progress, {
      inputRange : [0, 25],
      outputRange: [1, 0],
    });

    this._rootContainerMargin = interpolate(progress, {
      inputRange : [0, 100 ],
      outputRange: [0, 
        Reanimated.multiply(this.containerHeight, -1)
      ],
    });

    this.animation = timing(progress, {
      duration: 500,
      toValue : 100,
      easing: Easing.inOut(Easing.ease),
    });

    this._handleOnPressDelete       = debounce(this._handleOnPressDelete      , 750, {leading: true});
    this._handleOnPressQuestionItem = debounce(this._handleOnPressQuestionItem, 750, {leading: true});
  };

  _handleOnPressQuestionItem = async () => {
    const { index, onPressQuestionItem, ...props } = this.props;
    const question = QuizQuestionModel.extract(props);

    await this.rootContainerRef.pulse(300);
    onPressQuestionItem && onPressQuestionItem(
      { index, question }
    );
  };

  _handleOnPressDelete = async () => {
    const { index, onPressDelete, ...props } = this.props;
    const question = QuizQuestionModel.extract(props);

    const { height } = await Helpers.asyncMeasure(this.contentRef);
    this.containerHeight.setValue(height);

    this.animation.start(() => {
      onPressDelete && onPressDelete(
        { index, question }
      );
    });
  };

  _renderRightActions = (progress, dragX) => {
    const { styles } = QuizAddQuestionModalItem;

    const opacity = progress.interpolate({
      inputRange : [0, 1],
      outputRange: [0.75, 1],
    });

    const translateX = progress.interpolate({
      inputRange : [0, 1],
      outputRange: [ITEM_WIDTH, 0],
    });

    const actionContainerStyle = {
      opacity,
      transform: [{ translateX }]
    };

    return (
      <Animated.View style={[styles.actionContainer, actionContainerStyle]}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: 'red' }]}
          onPress={this._handleOnPressDelete}
        >
          <Text style={styles.actionText}>
            {'Delete'}
          </Text>
        </RectButton>
      </Animated.View>
    );
  };

  render(){
    const { styles } = QuizAddQuestionModalItem;
    const { index, ...props } = this.props;

    const rootContainerStyle = {
      opacity: this._rootContainerOpacity,
      margin : this._rootContainerMargin,
    };

    const question    = props[QuizQuestionKeys.questionText];
    const answer      = props[QuizQuestionKeys.questionAnswer];
    const sectionType = props[QuizQuestionKeys.sectionType];
    
    const displayAnswer = ((sectionType == SectionTypes.TRUE_OR_FALSE)
      ? (answer? 'True' : 'False')
      : answer
    );

    const QuestionDetails = (
      <View ref={r => this.contentRef = r}>
        <Text numberOfLines={5}>
          <Text style={styles.textQuestionIndicator}>
            {`${index + 1}. `}
          </Text>
          <Text style={styles.textQuestionBody}>
            {question}
          </Text>
        </Text>
        <Text>
          <Text style={styles.textAnswerLabel}>
            {'Answer: '}
          </Text>
          <Text style={styles.textAnswer}>
            {displayAnswer}
          </Text>
        </Text>
      </View>
    );

    return(
      <Swipeable
        friction={1.5}
        rightThreshold={50}
        overshootRight={false}
        renderRightActions={this._renderRightActions}
      >
        <Reanimated.View style={rootContainerStyle}>
          <Animatable.View
            ref={r => this.rootContainerRef = r}
            useNativeDriver={true}
          >
            <ModalSection 
              hasMarginBottom={false}
              showBorderTop={false}
              hasPadding={false}
            >
              <TouchableOpacity
                style={styles.rootContainer}
                activeOpacity={0.75}
                onPress={this._handleOnPressQuestionItem}
              >
                {QuestionDetails}
              </TouchableOpacity>
            </ModalSection>
          </Animatable.View>
        </Reanimated.View>
      </Swipeable>
    );
  };
};