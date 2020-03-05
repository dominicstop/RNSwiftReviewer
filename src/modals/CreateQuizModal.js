import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Keyboard } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { ModalBackground   } from 'app/src/components/ModalBackground';
import { ModalHeader       } from 'app/src/components/ModalHeader';
import { ModalFooter       } from 'app/src/components/ModalFooter';
import { ModalFooterButton } from 'app/src/components/ModalFooterButton';
import { ModalSection      } from 'app/src/components/ModalSection';
import { ModalInputField   } from 'app/src/components/ModalInputField';
import { ListFooterIcon    } from 'app/src/components/ListFooterIcon';


import { ROUTES, RNN_ROUTES } from 'app/src/constants/Routes';

import { BLUE } from 'app/src/constants/Colors';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';


export class CreateQuizModal extends React.Component {
  static options() {
    return {
    };
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    headerContainer: {
      paddingVertical: 10,
    },
  });

  _handleOnSubmitEditing = ({index}) => {
    if(index == 0){
      this.inputRefDesc.focus();

    } else if(index == 1){
      Keyboard.dismiss();
    };
  };

  _handleOnPressButtonLeft = async () => {
    const { navigation, componentId } = this.props;

    const isValidTitle    = this.inputFieldRefTitle.isValid(true);
    const isValidSubtitle = this.inputFieldRefDesc .isValid(true);

    if(isValidTitle && isValidSubtitle){
      navigation && navigation.navigate(
        ROUTES.createQuizRoute
      );

      await Promise.all([
        Helpers.timeout(500),
      ]);
      
      //close modal
      Navigation.dismissModal(componentId);
    };
  };

  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    //close modal
    await Helpers.timeout(200);
    Navigation.dismissModal(componentId);
  };

  render(){
    const { styles } = CreateQuizModal;

    const modalHeader = (
      <ModalHeader
        title={'Create New Quiz'}
        subtitle={"Press 'Create Quiz' when done."}
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
          buttonLeftSubtitle={'Create new quiz'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    return (
      <ModalBackground
        {...{modalHeader, modalFooter}}
      >
        <ModalSection showBorderTop={false}>
          <ModalInputField
            index={0}
            ref={r => this.inputFieldRefTitle = r}
            inputRef={r => this.inputRefTitle = r}
            title={'Quiz Title'}
            subtitle={'Give this quiz a title (ex: Math Prelims etc.)'}
            placeholder={'Enter Quiz Title'}
            onSubmitEditing={this._handleOnSubmitEditing}
            validate={Validate.isNotNullOrWhitespace}
            iconActive={(
              <SvgIcon
                name={SVG_KEYS.BookFilled}
                size={20}
              />
            )}
            iconInactive={(
              <SvgIcon
                name={SVG_KEYS.BookOutlined}
                size={20}
              />
            )}
          />
        </ModalSection>
        <ModalSection showBorderTop={false}>
          <ModalInputField
            index={1}
            ref={r => this.inputFieldRefDesc = r}
            inputRef={r => this.inputRefDesc = r}
            title={'Description'}
            subtitle={'Give this quiz a short description.'}
            placeholder={'Enter Quiz Title'}
            validate={Validate.isNotNullOrWhitespace}
            iconActive={(
              <SvgIcon
                name={SVG_KEYS.BookFilled}
                size={20}
              />
            )}
            iconInactive={(
              <SvgIcon
                name={SVG_KEYS.BookOutlined}
                size={20}
              />
            )}
          />
        </ModalSection>
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};
