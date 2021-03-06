// used in CreateQuizScreen

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import moment   from 'moment';
import Feather  from 'react-native-vector-icons/Feather';
import debounce from 'lodash/debounce';

import { iOSUIKit         } from 'react-native-typography';
import { Divider          } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { ListCard        } from 'app/src/components/ListCard';
import { ListItemBadge   } from 'app/src/components/ListItemBadge';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import { QuizKeys } from 'app/src/constants/PropKeys';


class QuizListItemHeader extends React.PureComponent {
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
      color: Colors.GREY[900],
    },
    textDateCreatedMiddle: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[800],
    },
    textDateCreatedLast: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[600],
      opacity: 0.75,
    },
  });

  render(){
    const { styles } = QuizListItemHeader;
    const { quiz, index } = this.props;

    const title       = quiz[QuizKeys.quizTitle      ] ?? 'Title N/A';
    const createdUnix = quiz[QuizKeys.quizDateCreated] ?? 0;

    const dateCreated = moment.unix(createdUnix / 1000);

    const DateCreated = (
      <View style={styles.titleDateContainer}>
        <Feather
          name={'clock'}
          size={14}
          color={Colors.GREY[800]}
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
          marginRight={8}
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

class QuizListItemStats extends React.PureComponent {
  static propTypes = {
    quiz: PropTypes.object,
  };
  
  static styles = StyleSheet.create({
    rootContainer: {
      marginTop: 10,
    },
  });

  render(){
    const { styles } = QuizListItemStats;
    const { quiz } = this.props;

    const timesTaken    = quiz[QuizKeys.quizTimesTaken   ] ?? 0;
    const sectionCount  = quiz[QuizKeys.quizSectionCount ] ?? 0;
    const questionCount = quiz[QuizKeys.quizQuestionCount] ?? 0;
    const lastTaken     = quiz[QuizKeys.quizDateLastTaken] ?? 0;

    const dateLastTaken = moment.unix(lastTaken / 1000);
    const textLastTaken = (lastTaken
      ? dateLastTaken.fromNow()
      : 'N/A'
    );

    const textTaken     = `${timesTaken   } ${Helpers.plural('time', timesTaken   )}`;
    const textSections  = `${sectionCount } ${Helpers.plural('item', sectionCount )}`;
    const textQuestions = `${questionCount} ${Helpers.plural('item', questionCount)}`;

    return(
      <TableLabelValue
        containerStyle={styles.rootContainer}
        labelValueMap={[
          ['Taken'    , textTaken    ],
          ['Sections' , textSections ],
          ['Last'     , textLastTaken],
          ['Questions', textQuestions],
        ]}
      />
    );
  };
};

// used in screens/QuizListScreen
// sectionList: renderItem comp
// displays quiz details: title, desc, etc.
export class QuizListItem extends React.PureComponent {
  static propTypes = {
    quiz : PropTypes.object,
    index: PropTypes.number,
    onPressQuizItem: PropTypes.func,
  };
  
  static styles = StyleSheet.create({
    textDescription: {
      ...iOSUIKit.bodyObject,
      color: Colors.GREY[800],
    },
    textDescriptionLabel: {
      ...iOSUIKit.bodyEmphasizedObject,
      color: Colors.GREY[900]
    },
    divider: {
      margin: 10,
    },
  });

  constructor(props){
    super(props);

    this._handleOnPress = debounce(this._handleOnPress, 750, {leading: true});
  };
  
  _handleOnPress = async () => {
    const { quiz, index, onPressQuizItem } = this.props;

    this.rootContainerRef.pulse(300);
    onPressQuizItem && onPressQuizItem({quiz, index});
  };

  render(){
    const { styles } = QuizListItem;
    const { quiz, index } = this.props;

    const description = quiz[QuizKeys.quizDesc] ?? 'No Description';

    return(
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <ListCard>
          <TouchableOpacity
            onPress={this._handleOnPress}
            activeOpacity={0.5}
          >
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
          </TouchableOpacity>
        </ListCard>
      </Animatable.View>
    );
  };
};