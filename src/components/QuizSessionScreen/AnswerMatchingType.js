import React from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import * as Helpers from 'app/src/functions/helpers';
import * as Colors  from 'app/src/constants/Colors';

import { QuizQuestionModel } from 'app/src/models/QuizQuestionModel';
import { iOSUIKit } from 'react-native-typography';

export class AnswerMatchingType extends React.PureComponent {

  _handleOnPressChooseAnswer = () => {
    const { onPressChooseAnswer, ...props } = this.props;

    // extract question values from props
    const question = QuizQuestionModel.extract(props);
    
    onPressChooseAnswer && onPressChooseAnswer(question);
  };

  render(){
    return (
      <View style={styles.rootContainer}>
        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.8}
          onPress={this._handleOnPressChooseAnswer}
        >
          <Ionicon
            name={'ios-filing'}
            color={Colors.BLUE.A700}
            size={26}
          />
          <Text style={styles.buttonTextTitle}>
            {'Choose Answer...'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: Helpers.hexToRGBA(Colors.BLUE.A700, 0.9),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
    marginBottom: 20,
    marginHorizontal: 13,
    borderWidth: 1,
    borderColor: Helpers.hexToRGBA(Colors.BLUE[900], 0.25),
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    //shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 1.41,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  buttonTextTitle: {
    ...iOSUIKit.bodyEmphasizedObject,
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '800',
    color: Colors.BLUE.A700,
  },
});