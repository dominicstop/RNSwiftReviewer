import React, { Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import SegmentedControlIOS from '@react-native-community/segmented-control';

import * as Animatable from 'react-native-animatable';

import { Divider  } from 'react-native-elements';
import { iOSUIKit } from 'react-native-typography';

import { ModalSection        } from 'app/src/components/ModalSection';
import { ModalInputMultiline } from 'app/src/components/ModalInputMultiline';
import { ImageTitleSubtitle  } from 'app/src/components/ImageTitleSubtitle';
import { ListItemBadge       } from 'app/src/components/ListItemBadge';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { QuizSectionModel } from 'app/src/models/QuizSectionModel';

class ChoiceItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 13,
      paddingBottom: 13,
    },
    border: {
      borderBottomColor: 'rgba(0,0,0,0.15)',
      borderBottomWidth: 1,
    },
    textChoice: {
      ...iOSUIKit.bodyObject,
      flex: 1,
      marginLeft: 7,
      color: Colors.GREY[900]
    },
    textChoiceSelected: {
      ...iOSUIKit.bodyEmphasizedObject,
      flex: 1,
      marginLeft: 7,
      color: Colors.GREY[900]
    },
  });

  _handleOnPressChoice = () => {
    const { onPressChoice, answer, index } = this.props;

    this.rootContainerRef.pulse(200);
    onPressChoice && onPressChoice(
      { answer, index }
    );
  };

  render(){
    const { styles } = ChoiceItem;
    const { isLast, answer, index, selectedAnswer } = this.props;

    const isFirst    = (index == 0);
    const isSelected = (answer == selectedAnswer);

    const rootContainerStyle = {
      ...(!isLast && styles.border),
      ...(isFirst && { marginTop: 5 }),
      ...(isLast  && { paddingBottom: 2 }),
    };

    return(
      <TouchableOpacity
        key={`${answer}-${index}`}
        activeOpacity={0.8}
        onPress={this._handleOnPressChoice}
      >
        <Animatable.View
          ref={r => this.rootContainerRef = r}
          style={[styles.rootContainer, rootContainerStyle]}
          useNativeDriver={true}
        >
          <ListItemBadge
            value={(index + 1)}
            size={21}
            textStyle={{fontWeight: '800'}}
            containerStyle={{marginTop: 1}}
            color={(isSelected
              ? Colors.GREEN[100]
              : Colors.BLUE [100]
            )}
            textColor={(isSelected
              ? Colors.GREEN [700]
              : Colors.INDIGO.A700
            )}
          />
          <Text style={(isSelected
            ? styles.textChoiceSelected
            : styles.textChoice
          )}>
            {answer}
          </Text>
        </Animatable.View>
      </TouchableOpacity>
    );
  };
};

export class SectionMatchingType extends React.PureComponent {
  static styles = StyleSheet.create({
    answerContainer: {
    },
    segmentedControl: {
      height: 35,
      marginBottom: 12,
    },
  });

  constructor(props){
    super(props);
    
    const answers     = QuizSectionModel.extractAnswers(props.section);
    const answerCount = (answers?.length ?? 0);

    const isAnswerDuplicate = answers.includes(props.answer);

    this.state = {
      answerCount,
      selectedAnswer: null,
      showSegmentedControl: (answerCount > 0),
      showChoices: (
        (props.isEditing  ) &&
        (isAnswerDuplicate) &&
        (answerCount > 0  )
      )
    };
  };

  getAnswerValue = () => {
    const { showChoices, selectedAnswer } = this.state;

    if(!showChoices && this.inputFieldRefAnswer){
      const answer = this.inputFieldRefAnswer.getTextValue();
      return answer;

    } else {
      return selectedAnswer;
    };
  };

  _handleSegmentControlOnChange = async ({nativeEvent}) => {
    const index = nativeEvent.selectedSegmentIndex;
    const showChoices = (index == 1);

    if(showChoices){
      await this.answerContainerRef.fadeOutRight(200);
      this.setState({showChoices});
      await this.answerContainerRef.fadeInLeft(150);

    } else {
      await this.answerContainerRef.fadeOutLeft(200);
      this.setState({showChoices});
      await this.answerContainerRef.fadeInRight(150);
    };
  };

  _handleOnPressChoice = ({ answer, index }) => {
    this.setState({
      selectedAnswer: answer
    });
  };

  _renderChoices(){
    const { section } = this.props;
    const { selectedAnswer } = this.state;

    const answers     = QuizSectionModel.extractAnswers(section);
    const answerCount = (answers?.length ?? 0);

    return answers.map((answer, index) => (
      <ChoiceItem
        isLast={(index == (answerCount - 1))}
        onPressChoice={this._handleOnPressChoice}
        {...{answer, index, selectedAnswer}}
      />
    ));
  };

  render(){
    const { styles } = SectionMatchingType;
    const { section } = this.props;
    const { showChoices, answerCount, ...state } = this.state;

    return(
      <ModalSection showBorderTop={false}>
        {(state.showSegmentedControl) && (
          <SegmentedControlIOS
            style={styles.segmentedControl}
            values={['New Choice', 'Choose...']}
            activeTextColor={Colors.BLUE[1000]}
            onChange={this._handleSegmentControlOnChange}
            selectedIndex={(showChoices? 1 : 0)}
          />
        )}
        <Animatable.View 
          ref={r => this.answerContainerRef = r}
          style={styles.answerContainer}
          useNativeDriver={true}
        >
          {showChoices?(
            <Fragment>
              <ImageTitleSubtitle
                containerStyle={{marginTop: 5}}
                title={`Showing ${answerCount} ${Helpers.plural('choice', answerCount)}`}
                subtitle={'Here are all the choices in this section. Tap and choose the corresponding answer for this question.'}
                imageSource={require('app/assets/icons/e-block-choice.png')}
                hasPadding={false}
              />
              {this._renderChoices()}
            </Fragment>
          ):(
            <ModalInputMultiline
              index={1}
              ref={r => this.inputFieldRefAnswer = r}
              inputRef={r => this.inputRefAnswer = r}
              subtitle={"Enter the corresponding answer"}
              placeholder={'Input Answer Text'}
              //initialValue={(answer ?? '')}
              onSubmitEditing={this._handleOnSubmitEditing}
              validate={Validate.isNotNullOrWhitespace}
            />
          )}
        </Animatable.View>
      </ModalSection>
    );
  };
};