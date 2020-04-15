import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import * as Helpers from 'app/src/functions/helpers';


export class QuizQuestionItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  render(){
    const { styles } = QuizQuestionItem;
    const { index } = this.props;

    const rootContainerStyle = {
      backgroundColor: ((index % 2 == 0)
        ? 'red'
        : 'green'
      ),
    };

    return(
      <View style={[styles.rootContainer, rootContainerStyle]}>
        <Text style={{fontSize: 64}}>{index}</Text>
      </View>
    );
  };
};