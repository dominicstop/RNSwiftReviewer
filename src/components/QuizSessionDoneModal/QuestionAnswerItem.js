import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import moment  from 'moment';

import { ModalSection    } from 'app/src/components/ModalSection';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { QuizKeys } from 'app/src/constants/PropKeys';


export class QuestionAnswerItem extends React.Component {
  render(){
    return (
      <Text>Item</Text>
    );
  };
};