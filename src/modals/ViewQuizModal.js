import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { ModalBackground } from 'app/src/components/ModalBackground';
import { ModalHeader     } from 'app/src/components/ModalHeader';
import { ModalSection    } from 'app/src/components/ModalSection';

import { ROUTES } from 'app/src/constants/Routes';


export class ViewQuizModal extends React.Component {
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
    const { styles } = ViewQuizModal;

    const modalHeader = (
      <ModalHeader
        title={'View Quiz'}
        subtitle={'Praesent commodo cursus magna, ve'}
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
        <ModalSection>
          <Text style={{fontSize: 24}}>ViewQuizModal</Text>
        </ModalSection>
      </ModalBackground>
    );
  };
};
