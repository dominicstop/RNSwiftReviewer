import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { iOSUIKit   } from 'react-native-typography';
import { Navigation } from 'react-native-navigation';

import { ListItemBadge  } from 'app/src/components/ListItemBadge';
import { ListFooterIcon } from 'app/src/components/ListFooterIcon';

import { ModalBody         } from 'app/src/components/Modal/ModalBody';
import { ModalHeader       } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter       } from 'app/src/components/Modal/ModalFooter';
import { ModalFooterButton } from 'app/src/components/Modal/ModalFooterButton';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { BORDER_WIDTH               } from 'app/src/constants/UIValues';
import { QuizSessionAnswerKeys      } from 'app/src/constants/PropKeys';
import { MNPQuizSessionChooseAnswer } from 'app/src/constants/NavParams';


class ChoiceItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderBottomColor: 'rgba(0,0,0,0.3)',
      borderBottomWidth: BORDER_WIDTH,
    },
    contentContainer: {
      flexDirection: 'row',
      marginHorizontal: 10,
      marginVertical: 12,
      alignItems: 'center',
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: Colors.BLUE[50],
    },
    textChoice: {
      ...iOSUIKit.subheadObject,
      flex: 1,
    },
    textChoiceSelected: {
      ...iOSUIKit.subheadEmphasizedObject,
    },
  });

  _handleOnPress = () => {
    const { onChoiceSelected, choice, index } = this.props;

    onChoiceSelected && onChoiceSelected(choice, index);
    this.rootContainerRef.pulse(300);
  };

  render(){
    const { styles } = ChoiceItem;
    const { choice, index, selected } = this.props;

    const isSelected = (choice == selected);

    return (
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <TouchableOpacity
          style={styles.rootContainer}
          onPress={this._handleOnPress}
          activeOpacity={0.5}
        >
          {isSelected && (
            <Animatable.View
              style={styles.background}
              animation={'breathe'}
              duration={3000}
              iterationDelay={1000}
              iterationCount={'infinite'}
              easing={'ease-in-out'}
              useNativeDriver={true}
            />
          )}
          <View style={styles.contentContainer}>
            <ListItemBadge
              size={20}
              value={(index + 1)}
              marginRight={8}
              color={(isSelected
                ? Colors.BLUE.A700
                : Colors.BLUE[50]
              )}
              textColor={(isSelected
                ? 'white'
                : Colors.BLUE.A700
              )}
            />
            <Text style={[
              styles.textChoice,
              isSelected && styles.textChoiceSelected
            ]}>
              {choice}
            </Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};

export class QuizSessionChooseAnswerModal extends React.Component {
  constructor(props){
    super(props);

    const answer      = props?.[MNPQuizSessionChooseAnswer.answer] ?? {};
    const answerValue = answer [QuizSessionAnswerKeys.answerValue];

    this.state = {
      selected: answerValue,
    };
  };

  componentDidMount(){
    const { getModalRef } = this.props;
    if(getModalRef){
      // ModalView: receive modal ref
      this.modalRef = getModalRef();
    };
  };

  _handleOnChoiceSelected = (choice, index) => {
    this.setState({selected: choice});
  };

  _handleOnPressButtonLeft = async () => {
    const props = this.props;
    const { selected } = this.state;

    const question    = props[MNPQuizSessionChooseAnswer.question];
    const onPressDone = props[MNPQuizSessionChooseAnswer.onPressDone];

    onPressDone && onPressDone({
      question,
      answer: selected
    });

    await Helpers.timeout(200);
    //close modal
    this.modalRef.setVisibility(false);
  };

  _handleOnPressButtonRight = async () => {
    await Helpers.timeout(200);
    //close modal
    this.modalRef.setVisibility(false);
  };
  
  render(){
    const { selected } = this.state;
    const props = this.props;

    const sectionChoices = props[MNPQuizSessionChooseAnswer.sectionChoices];

    const modalHeader = (
      <ModalHeader
        title={'Choose Answer'}
        subtitle={"Choose from the following choices..."}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-filing'}
            size={24}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonLeftTitle={'Done'}
          buttonLeftSubtitle={'Save answer'}
          buttonRightSubtitle={'Close this modal'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    return (
      <ModalBody
        wrapInScrollView={true}
        animateAsGroup={true}
        {...{modalHeader, modalFooter}}
      >
        {sectionChoices.map((choice, index) => (
          <ChoiceItem
            key={`choice-${choice}`}
            onChoiceSelected={this._handleOnChoiceSelected}
            {...{choice, index, selected}}
          />
        ))}
        <ListFooterIcon
          show={true}
          hasEntranceAnimation={false}
        />
      </ModalBody>
    );
  };
};