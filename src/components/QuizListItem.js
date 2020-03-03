import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import   moment     from 'moment';
import   Feather    from '@expo/vector-icons/Feather';
import { iOSUIKit } from 'react-native-typography';
import { Divider  } from 'react-native-elements';

import { ListCard } from 'app/src/components/ListCard';
import { ListItemBadge } from 'app/src/components/ListItemBadge';
import { GREY, BLUE, INDIGO } from 'app/src/constants/Colors';
import { QuizKeys } from 'app/src/models/QuizModel';
import { plural } from '../functions/helpers';

class QuizListItemHeader extends React.Component {
  static propTypes = {
    quiz : PropTypes.object,
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
    const { styles } = QuizListItemHeader;
    const { quiz, index } = this.props;

    const title       = quiz[QuizKeys.quizTitle      ] ?? 'Title N/A';
    const createdUnix = quiz[QuizKeys.quizDateCreated] ?? 0;

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

class QuizListItemStats extends React.Component {
  static propTypes = {
    quiz: PropTypes.object,
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
    const { styles } = QuizListItemStats;
    const { quiz } = this.props;

    const timesTaken    = quiz[QuizKeys.quizTimesTaken   ] ?? 0;
    const sectionCount  = quiz[QuizKeys.quizSectionCount ] ?? 0;
    const questionCount = quiz[QuizKeys.quizQuestionCount] ?? 0;
    const lastTaken     = quiz[QuizKeys.quizDateLastTaken] ?? 0;

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
              {'Sections'}
            </Text>
            <Text 
              style={styles.textDetail}
              numberOfLines={1}
            >
              {`${sectionCount} ${plural('item', sectionCount)}`}
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

export class QuizListItem extends React.Component {
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
    quiz : PropTypes.object,
    index: PropTypes.number,
    onPressQuizItem: PropTypes.func,
  };

  _handleOnPress = () => {
    const { quiz, index, onPressQuizItem } = this.props;
    onPressQuizItem && onPressQuizItem({quiz, index});
  };

  render(){
    const { styles } = QuizListItem;
    const { quiz, index } = this.props;

    const description = quiz[QuizKeys.quizDesc] ?? 'No Description';

    return(
      <TouchableOpacity
        onPress={this._handleOnPress}
        activeOpacity={0.8}
      >
        <ListCard>
          <QuizListItemHeader
            {...{quiz, index}}
          />
          <QuizListItemStats
            {...{quiz}}
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
      </TouchableOpacity>
    );
  };
};