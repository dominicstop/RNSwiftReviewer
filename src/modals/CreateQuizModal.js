import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { ModalBackground } from 'app/src/components/ModalBackground';
import { ModalHeader     } from 'app/src/components/ModalHeader';
import { ModalSection    } from 'app/src/components/ModalSection';
import { ModalInputField } from 'app/src/components/ModalInputField';

import { ROUTES } from 'app/src/constants/Routes';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { BLUE } from '../constants/Colors';
import * as Validate from '../functions/Validate';


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

  _handleOnPressCloseModal = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTES.appStackRoute);
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

    return (
      <ModalBackground
        {...{modalHeader}}
      >
        <ModalSection showBorderTop={false}>
          <ModalInputField
            title={'Quiz Title'}
            subtitle={'Give this quiz a title (ex: Math Prelims etc.)'}
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
        <ModalSection showBorderTop={false}>
          <ModalInputField
            title={'Quiz Description'}
            subtitle={'Give this quiz a short description.'}
            placeholder={'Enter Quiz Title'}
            validate={Validate.isNotNullOrWhitespace}
          />
        </ModalSection>
      </ModalBackground>
    );
  };
};
