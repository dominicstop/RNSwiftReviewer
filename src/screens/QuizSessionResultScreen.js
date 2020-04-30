import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { ListCard } from 'app/src/components/ListCard';
import { HeaderValues } from 'app/src/constants/HeaderValues';


const HEADER_HEIGHT = HeaderValues.getHeaderHeight(false);


class SessionResults extends React.Component {
  static styles = StyleSheet.create({

  });

  render(){
    const { styles } = SessionResults;

    return (
      <ListCard>

      </ListCard>
    );
  };
};

export class QuizSessionResultScreen extends React.Component {
  static navigationOptions = {
    title: 'Quiz Results',
  };

  render(){
    return(
      <ScrollView
        contentInset={{ top: HEADER_HEIGHT }}
      >
        <SessionResults/>
      </ScrollView>
    );
  };
};