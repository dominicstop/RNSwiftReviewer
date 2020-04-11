import React, { Fragment } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon from '@expo/vector-icons/Ionicons';

import * as Animatable from 'react-native-animatable';

import { Divider } from 'react-native-elements';
import { iOSUIKit } from 'react-native-typography';

import { ModalSection       } from 'app/src/components/ModalSection';
import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';
import { ButtonGradient     } from 'app/src/components/ButtonGradient';
import { ListItemBadge      } from 'app/src/components/ListItemBadge';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';


function getTitleSubtitle(choiceCount){
  const suffix = Helpers.plural('choice', choiceCount);

  return ((choiceCount <= 0)? {
    title   : 'No Choices Yet',
    subtitle: 'You need to create a minimium of at least two choices first!',
  }:(choiceCount <= 0)? {
    title   : 'Add at least one more!',
    subtitle: 'You need to create a minimium of at least two choices first!',
  }:(choiceCount <= 3)? {
    title   : `Showing ${choiceCount} ${suffix}`,
    subtitle: 'You can add up to a maximum of 4 choices. The selected choice is the correct answer for this question.',
  }:{
    title   : `Showing ${choiceCount} ${suffix}`,
    subtitle: "Sorry, you can't add any more choices. The selected choice is the correct answer for this question.",
  });
};

class ChoiceItem extends React.PureComponent {
  static styles = StyleSheet.create({
    divider: {
      margin: 10,
    },
    borderTop: {
      borderTopWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    choiceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
    },
    choiceText: {
      ...iOSUIKit.bodyObject,
      marginLeft: 10,
    },
    choiceTextSelected: {
      ...iOSUIKit.bodyEmphasizedObject,
      marginLeft: 10,
      color: Colors.GREEN.A700,
      fontWeight: '700',
    },
  });

  _handleOnPressChoice = () => {
    const { onPressChoice, selectedChoice, index, choice } = this.props;
    const isSelected = (selectedChoice == choice);

    this.containerRef.pulse(300);

    if(!isSelected){
      onPressChoice && onPressChoice(
        { index, choice }
      );
    };
  };

  render(){
    const { styles } = ChoiceItem;
    const { index, choice, selectedChoice, isLast } = this.props;

    const isSelected = (choice == selectedChoice);
    const isFirst    = (index == 0);
    
    return(
      <Fragment>
        <Animatable.View
          ref={r => this.containerRef = r}
          useNativeDriver={true}
        >
          <TouchableOpacity
            onPress={this._handleOnPressChoice}
            activeOpacity={0.9}
            style={[styles.choiceContainer, {
              ...(!isFirst && styles.borderTop    ),
              ...(isFirst  && { paddingTop   : 0 }),
              ...(isLast   && { paddingBottom: 0 }),
            }]}
          >
            <ListItemBadge
              value={Helpers.getLetter(index)}
              size={20}
              color={(isSelected
                ? Colors.GREEN .A700
                : Colors.INDIGO.A200
              )}
            />
            <Text style={(isSelected
              ? styles.choiceTextSelected
              : styles.choiceText
            )}>
              {choice}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </Fragment>
    );
  };
};

export class SectionMultipleChoice extends React.PureComponent {
  static propTypes = {
    onAddChoice: PropTypes.onAddChoice,
  };

  static styles = StyleSheet.create({
    buttonCreateChoice: {
      marginHorizontal: 0, 
      marginVertical: 0
    },
    divider: {
      marginTop: 10,
      marginBottom: 12,
    },
    choicesContainer: {
      marginTop: 12,
    },
  });

  constructor(props){
    super(props);
    
    this.state = {
      choices       : props.choices ?? [],
      selectedChoice: props.selectedChoices ?? null,
    };
  };

  addChoice = async (choice = '') => {
    this.rootContainerRef.pulse(750);
    await this.headerRef.fadeOut(250);

    this.setState((prevState) => ({
      choices: [
        ...(prevState.choices ?? []),
        choice
      ],
    }));

    await this.headerRef.fadeIn(250);
  };

  getChoices = () => {
    const { choices, selectedChoice } = this.state;
    
    return ({ choices, selectedChoice });
  };

  validate = (animate) => {
    const { choices, selectedChoice } = this.state;
    const choiceCount = choices?.length ?? 0;

    const isValid = (
      (choiceCount    >= 2   ) &&
      (selectedChoice != null)
    );

    if(animate){
      this.rootContainerRef.shake(750);
    };

    return isValid;
  };

  _handleOnPressAddChoice = async () => {
    const { onAddChoice } = this.props;
    const { choices } = this.state;

    const choiceCount = choices?.length ?? 0;
    if(choiceCount >= 4){
      Alert.alert(
        "Max Reached",
        "Cannot add any more choices, sorry."
      );
      // early return
      return;
    };

    try {
      const textInput = await Helpers.asyncAlertInput({
        title : 'New Choice Item',
        desc  : 'Type out the choice to be added.',
        okText: 'Add'
      });

      const isDuplicate = choices.includes(textInput);

      if(!Validate.isNotNullOrWhitespace(textInput)){
        Alert.alert(
          'Invalid Input', 
          'Cannot create choice with the given input value, please try again.'
        );
      
      } else if(isDuplicate) {
        Alert.alert(
          'Choice already exists', 
          'Cannot add item because the choice already exists.'
        );

      } else {
        await this.addChoice(textInput);

        // call callback
        onAddChoice && onAddChoice(textInput);
      };
    } catch(error){
      console.log('Cancel pressed.');
    };
  };

  // ChoiceItem: onPress callback
  _handleOnPressChoice = ({choice, index}) => {
    this.setState({
      selectedChoice: choice,
    });
  };

  render(){
    const { styles } = SectionMultipleChoice;
    const { choices, selectedChoice } = this.state;
    const props = this.props;

    const choiceCount = choices?.length ?? 0;
    const imageTitleSubtitleProps = getTitleSubtitle(choiceCount);

    return (
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <ModalSection showBorderTop={false}>
          <Animatable.View
            ref={r => this.headerRef = r}
            useNativeDriver={true}
          >
            <ImageTitleSubtitle
              imageSource={require('app/assets/icons/lbw-laptop-construction.png')}
              hasPadding={false}
              {...imageTitleSubtitleProps}
            />
          </Animatable.View>
          {(choiceCount > 0) && (
            <Animatable.View 
              style={styles.choicesContainer}
              ref={r => this.choicesContainerRef = r}
              useNativeDriver={true}
            >
              {choices.map((choice, index) =>
                <ChoiceItem
                  key={`$choiceItem-${choice}`}
                  isLast={(index == (choiceCount - 1))}
                  onPressChoice={this._handleOnPressChoice}
                  {...{choice, index, selectedChoice}}
                />
              )}
            </Animatable.View>
          )}
          <Divider style={styles.divider}/>
          <ButtonGradient
            containerStyle={styles.buttonCreateChoice}
            bgColor={Colors.BLUE[100]}
            fgColor={Colors.BLUE['A700']}
            alignment={'CENTER'}
            title={'Create Choice Item'}
            onPress={this._handleOnPressAddChoice}
            iconDistance={10}
            isBgGradient={false}
            addShadow={false}
            showIcon={true}
            leftIcon={(
              <Ionicon
                name={'ios-add-circle'}
                color={Colors.BLUE['A700']}
                size={25}
              />
            )}
          />
        </ModalSection>
      </Animatable.View>
    );
  };
};