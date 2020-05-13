import React, { Fragment } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { ModalBody          } from 'app/src/components/Modal/ModalBody';
import { ModalHeader        } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter        } from 'app/src/components/Modal/ModalFooter';
import { ModalSectionHeader } from 'app/src/components/Modal/ModalSectionHeader';
import { ModalSectionButton } from 'app/src/components/Modal/ModalSectionButton';
import { ModalFooterButton  } from 'app/src/components/Modal/ModalFooterButton';

import { ViewQuizOverlay     } from 'app/src/components/ViewQuizModal/ViewQuizOverlay';
import { ViewQuizDetails     } from 'app/src/components/ViewQuizModal/ViewQuizDetails';
import { ViewQuizSectionItem } from 'app/src/components/ViewQuizModal/ViewQuizSectionItem';
import { ViewQuizSessionItem } from 'app/src/components/ViewQuizModal/ViewQuizSessionItem';

import { ListFooterIcon } from 'app/src/components/ListFooterIcon';

import { ROUTES } from 'app/src/constants/Routes';

import { MNPViewQuiz, SNPQuizSession } from 'app/src/constants/NavParams';
import { QuizKeys, QuizSectionKeys, QuizSessionKeys } from 'app/src/constants/PropKeys';

import * as Helpers from 'app/src/functions/helpers';


export class QuizSessionQuestionsModal extends React.Component {
  render(){

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

    const overlay = (
      <ViewQuizOverlay
        ref={r => this.overlayRef = r}
      />
    );

    return (
      <ModalBody
        headerMode={'DEFAULT'}
        wrapInScrollView={false}
        {...{modalHeader, overlay}}
      >
        <FlatList
          data={[]}
        />
      </ModalBody>
    );
  };
};