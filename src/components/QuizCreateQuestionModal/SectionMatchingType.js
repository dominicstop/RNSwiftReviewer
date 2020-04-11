import React, { Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import SegmentedControlIOS from '@react-native-community/segmented-control';

import * as Animatable from 'react-native-animatable';

import { Divider } from 'react-native-elements';

import { ModalSection        } from 'app/src/components/ModalSection';
import { ModalInputMultiline } from 'app/src/components/ModalInputMultiline';
import { ImageTitleSubtitle  } from 'app/src/components/ImageTitleSubtitle';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { QuizSectionModel } from 'app/src/models/QuizSectionModel';


export class SectionMatchingType extends React.PureComponent {
  static styles = StyleSheet.create({
    answerContainer: {
    },
    choiceItemContainer: {
      paddingVertical: 7,
    },
    segmentedControl: {
      height: 35,
      marginBottom: 10,
    },
  });

  constructor(props){
    super(props);
    
    const answers     = QuizSectionModel.extractAnswers(props.section);
    const answerCount = (answers?.length ?? 0);

    const isAnswerDuplicate = answers.includes(props.answer);

    this.state = {
      answerCount,
      showSegmentedControl: (answerCount > 0),
      showChoices: (
        (props.isEditing  ) &&
        (isAnswerDuplicate) &&
        (answerCount > 0  )
      )
    };
  };

  getAnswerValue = () => {
    const { showChoices } = this.state;

    if(!showChoices && this.inputFieldRefAnswer){
      const answer = this.inputFieldRefAnswer.getTextValue();
      return answer;

    } else {
      return 'test';
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

  _renderChoices(){
    const { styles } = SectionMatchingType;
    const { section } = this.props;
    const answers  = QuizSectionModel.extractAnswers(section);

    return answers.map((answer, index) => (
      <TouchableOpacity
        key={`${answer}-${index}`}
        style={styles.choiceItemContainer}
      >
        <Text>
          {answer}
        </Text>
      </TouchableOpacity>
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
                subtitle={'Here are all the possible choices in this section. Tap and choose the corresponding answer for this question.'}
                imageSource={require('app/assets/icons/e-block-choice.png')}
                hasPadding={false}
              />
              <Divider style={{margin: 15}}/>
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