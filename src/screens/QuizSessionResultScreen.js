import React from 'react';
import { StyleSheet, View, Text, ScrollView, SectionList } from 'react-native';

import { ListCard } from 'app/src/components/ListCard';
import { ResultSummary } from 'app/src/components/QuizSessionResultScreen/ResultSummary';


import { HeaderValues } from 'app/src/constants/HeaderValues';
import { SNPQuizSessionResult } from '../constants/NavParams';
import { QuizSessionKeys, QuizSessionScoreKeys } from '../constants/PropKeys';


const HEADER_HEIGHT = HeaderValues.getHeaderHeight(false);

const QSRSectionTypes = {
  SUMMARY: 'SUMMARY',
};


export class QuizSessionResultScreen extends React.Component {
  static navigationOptions = {
    title: 'Quiz Results',
  };

  getSections(){

    const SummaryData = [
      { type: QSRSectionTypes.SUMMARY }
    ];

    return ([
      { type: QSRSectionTypes.SUMMARY, data: SummaryData },
    ]);
  };

  _handleKeyExtractor = (item, index) => {
    const type = item.type;

    switch (type) {
      case QSRSectionTypes.SUMMARY : return (`${type}-${index}`);
    };
  };

  _renderSectionSeperator = (data) => {
    if(data?.trailingItem) return null;

    return(
      <View style={{marginBottom: 20}}/>
    );
  };

  _renderItem = ({item, index, section}) => {
    const { navigation } = this.props;
    const { params } = navigation.state;

    const session = params[SNPQuizSessionResult.session];


    switch (section.type) {
      case QSRSectionTypes.SUMMARY: return (
        <ResultSummary
          {...{session}}
        />
      );
    };
  };

  render(){
    const { navigation } = this.props;
    const { params } = navigation.state;

    const quiz = params[SNPQuizSessionResult.quiz];
    const session = params[SNPQuizSessionResult.session];
    const sessions = params[SNPQuizSessionResult.sessions];

    const sections = this.getSections();

    return(
      <SectionList
        ref={r => this.sectionList = r}
        keyExtractor={this._handleKeyExtractor}
        renderItem={this._renderItem}
        contentInset={{ top: HEADER_HEIGHT }}
        //renderSectionHeader={this._renderSectionHeader}
        //SectionSeparatorComponent={this._renderSectionSeperator}
        //ListFooterComponent={this._renderListFooter}
        {...{sections}}
      />
    );
  };
};