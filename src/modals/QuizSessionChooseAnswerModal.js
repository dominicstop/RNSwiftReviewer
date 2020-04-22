import React, { Fragment } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';

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
import { } from 'app/src/constants/NavParams';

import * as Helpers from 'app/src/functions/helpers';


export class QuizSessionChooseAnswerModal extends React.Component {
  static styles = StyleSheet.create({

  });
  
  render(){
    const { styles } = QuizSessionChooseAnswerModal;

    const modalHeader = (
      <ModalHeader
        title={'View Quiz'}
        subtitle={"Press the \"Start Quiz\" to take this quiz."}
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
          buttonLeftTitle={'Start Quiz'}
          buttonLeftSubtitle={'New Session'}
          buttonRightSubtitle={'Close this modal'}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    return (
      <ModalBackground
        wrapInScrollView={true}
        {...{modalHeader, modalFooter, }}
      >
      </ModalBackground>
    );
  };
};