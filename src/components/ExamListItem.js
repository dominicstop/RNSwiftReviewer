import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as animatable from "react-native-animatable";

import   moment     from 'moment';
import   Feather    from 'react-native-vector-icons/Feather';
import { iOSUIKit } from 'react-native-typography';
import { Divider  } from 'react-native-elements';

import { ListCard } from 'app/src/components/ListCard';
import { ListItemBadge } from 'app/src/components/ListItemBadge';
import { GREY, BLUE, INDIGO } from 'app/src/constants/Colors';
import { ExamKeys } from 'app/src/models/ExamModel';
import { plural } from '../functions/helpers';
import { AnimatedListItem } from './AnimatedListItem';

class ExamListItemHeader extends React.Component {
  static propTypes = {
    exam : PropTypes.object,
    index: PropTypes.number,
  };
  
  static styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      flex: 1,
      fontWeight: '700'
    },
    textDateCreated: {
      marginLeft: 4,
    },
    textDateCreatedLabel: {
      ...iOSUIKit.subheadEmphasized,
      color: GREY[900],
    },
    textDateCreatedMiddle: {
      ...iOSUIKit.subheadObject,
      color: GREY[800],
    },
    textDateCreatedLast: {
      ...iOSUIKit.subheadObject,
      color: GREY[600],
    },
  });

  render(){
    const { styles } = ExamListItemHeader;
    const { exam, index } = this.props;

    const title       = exam[ExamKeys.examTitle      ] ?? 'Title N/A';
    const createdUnix = exam[ExamKeys.examDateCreated] ?? 0;

    const dateCreated = moment.unix(createdUnix);

    const DateCreated = (
      <View style={styles.titleDateContainer}>
        <Feather
          name={'clock'}
          size={14}
          color={GREY[800]}
        />
        <Text
          style={styles.textDateCreated}
          numberOfLines={1}
        >
          <Text style={styles.textDateCreatedLabel}>
            {'Created: '}
          </Text>
          <Text style={styles.textDateCreatedMiddle}>
            {dateCreated.format('MMM DD YYYY')}
          </Text>
          <Text style={styles.textDateCreatedLast}>
            {` (${dateCreated.fromNow()})`}
          </Text>
        </Text>
      </View>
    );

    return(
      <View style={styles.titleContainer}>
        <ListItemBadge
          size={20}
          value={(index + 1)}
          marginRight={7}
        />
        <View>
          <Text 
            style={styles.textTitle}
            numberOfLines={1}
          >
            {title}
          </Text>
          {DateCreated}
        </View>
      </View>
    );
  };
};

class ExamListItemStats extends React.Component {
  static propTypes = {
    exam: PropTypes.object,
  };
  
  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    columnLeftContainer: {
      flex: 1,
      marginRight: 5,
    },
    columnRightContainer: {
      flex: 1,
      marginLeft: 5,
    },
    rowContainer: {
      flexDirection: 'row',
    },
    textDetailLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      flex: 1,
    },
    textDetail: {
      ...iOSUIKit.subheadObject,
      color: GREY[800]
    },
  });

  render(){
    const { styles } = ExamListItemStats;
    const { exam } = this.props;

    const timesTaken    = exam[ExamKeys.examTimesTaken   ] ?? 0;
    const quizCount     = exam[ExamKeys.examQuizesCount  ] ?? 0;
    const questionCount = exam[ExamKeys.examQuestionCount] ?? 0;
    const lastTaken     = exam[ExamKeys.examDateLastTaken] ?? 0;

    const dateLastTaken = moment.unix(lastTaken);

    return(
      <View style={styles.rootContainer}>
        <View style={styles.columnLeftContainer}>
          <View style={styles.rowContainer}>
            <Text 
              style={styles.textDetailLabel}
              numberOfLines={1}
            >
              {'Taken'}
            </Text>
            <Text 
              style={styles.textDetail}
              numberOfLines={1}
            >
              {`${timesTaken} ${plural('time', timesTaken)}`}
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text 
              style={styles.textDetailLabel}
              numberOfLines={1}
            >
              {'Last'}
            </Text>
            <Text 
              style={styles.textDetail}
              numberOfLines={1}
            >
              {dateLastTaken.fromNow()}
            </Text>
          </View>
        </View>
        <View style={styles.columnRightContainer}>
          <View style={styles.rowContainer}>
            <Text 
              style={styles.textDetailLabel}
              numberOfLines={1}
            >
              {'Quizes'}
            </Text>
            <Text 
              style={styles.textDetail}
              numberOfLines={1}
            >
              {`${quizCount} ${plural('item', quizCount)}`}
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text 
              style={styles.textDetailLabel}
              numberOfLines={1}
            >
              {'Questions'}
            </Text>
            <Text 
              style={styles.textDetail}
              numberOfLines={1}
            >
              {`${questionCount} ${plural('item', questionCount)}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };
};

export class ExamListItem extends React.Component {
  static styles = StyleSheet.create({
    textDescription: {
      ...iOSUIKit.bodyObject,
      color: GREY[800],
    },
    textDescriptionLabel: {
      ...iOSUIKit.bodyEmphasizedObject,
      color: GREY[900]
    },
    divider: {
      margin: 10,
    },
  });

  static propTypes = {
    exam : PropTypes.object,
    index: PropTypes.number,
  };

  render(){
    const { styles } = ExamListItem;
    const { exam, index } = this.props;

    const description = exam[ExamKeys.examDesc] ?? 'No Description';

    return(
      <AnimatedListItem
        duration={250}
        {...{index}}
      >
        <ListCard>
          <ExamListItemHeader
            {...{exam, index}}
          />
          <ExamListItemStats
            {...{exam}}
          />
          <Divider style={styles.divider}/>
          <Text 
            style={styles.textDescription}
            numberOfLines={3}
          >
            <Text style={styles.textDescriptionLabel}>
              {'Description: '}
            </Text>
            {description}
          </Text>
        </ListCard>
      </AnimatedListItem>
    );
  };
};