import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Ionicon from '@expo/vector-icons/Ionicons';

import { Navigation } from 'react-native-navigation';

import { ModalBackground    } from 'app/src/components/ModalBackground';
import { ModalHeader        } from 'app/src/components/ModalHeader';
import { ModalFooter        } from 'app/src/components/ModalFooter';
import { ModalSectionHeader } from 'app/src/components/ModalSectionHeader';
import { ModalSectionButton } from 'app/src/components/ModalSectionButton';
import { ModalFooterButton  } from 'app/src/components/ModalFooterButton';
import { ListFooterIcon     } from 'app/src/components/ListFooterIcon';

import { ROUTES } from 'app/src/constants/Routes';

import { } from 'app/src/constants/PropKeys';
import { MNPQuizSessionChooseAnswer } from 'app/src/constants/NavParams';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { BORDER_WIDTH } from '../constants/UIValues';
import { ListItemBadge } from '../components/ListItemBadge';
import { iOSUIKit } from 'react-native-typography';


class ChoiceItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: 'rgba(255,255,255,0.7)',
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
              iterationCount={'infinite'}
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
  static styles = StyleSheet.create({

  });

  constructor(props){
    super(props);

    this.state = {
      selected: null,
    };
  };

  _handleOnChoiceSelected = (choice, index) => {
    this.setState({
      selected: choice,
    });
  };

  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;
    const { selected } = this.state;

    const question    = props[MNPQuizSessionChooseAnswer.question];
    const onPressDone = props[MNPQuizSessionChooseAnswer.onPressDone];

    onPressDone && onPressDone({
      answer: selected,
      question,
    });

    await Helpers.timeout(200);
    //close modal
    Navigation.dismissModal(componentId);
  };

  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    await Helpers.timeout(200);
    //close modal
    Navigation.dismissModal(componentId);
  };
  
  render(){
    const { styles } = QuizSessionChooseAnswerModal;
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
            name={'ios-book'}
            size={24}
            color={'white'}
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
      <ModalBackground
        wrapInScrollView={true}
        animateAsGroup={true}
        {...{modalHeader, modalFooter}}
      >
        {sectionChoices.map((choice, index) => (
          <ChoiceItem
            onChoiceSelected={this._handleOnChoiceSelected}
            {...{choice, index, selected}}
          />
        ))}
        <ListFooterIcon
          show={true}
          hasEntranceAnimation={false}
        />
      </ModalBackground>
    );
  };
};