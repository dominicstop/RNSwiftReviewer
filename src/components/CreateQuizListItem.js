import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon  from '@expo/vector-icons/Ionicons';
import debounce from "lodash/debounce";

import { iOSUIKit } from 'react-native-typography';
import { Divider  } from 'react-native-elements';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { ListCard        } from 'app/src/components/ListCard';
import { ListItemBadge   } from 'app/src/components/ListItemBadge';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import { QuizSectionKeys   } from 'app/src/constants/PropKeys';
import { SectionTypeTitles } from 'app/src/constants/SectionTypes';

class LeftRightButton extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 5,
      paddingVertical: 7,
      alignItems: 'center',
    },
    buttonLeftContainer: {
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      backgroundColor: Colors.BLUE[100],
    },
    buttonRightContainer: {
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      backgroundColor: Colors.INDIGO[100],
    },
    labelSubtitleContainer: {
      marginLeft: 10,
      justifyContent: 'center',
    },
    textButtonLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      fontWeight: '800',
      marginBottom: -2,
    },
    textButtonLeftLabel: {
      color: Colors.BLUE['800']
    },
    textButtonRightLabel: {
      color: Colors.INDIGO['800']
    },
    textButtonSubtitle: {
      ...iOSUIKit.subheadObject,
    },
    textButtonLeftSubtitle: {
      color: Colors.BLUE[900]
    },
    textButtonRightSubtitle: {
      color: Colors.INDIGO[900]
    },
  });

  render(){
    const { styles} = LeftRightButton;
    const props = this.props;

    return (
      <View style={styles.rootContainer}>
        <TouchableOpacity 
          style={[styles.buttonLeftContainer, styles.buttonContainer]}
          onPress={props.onPressLeftButton}
          activeOpacity={0.8}
        >
          <Ionicon
            name={'ios-cut'}
            size={24}
            color={Colors.BLUE[700]}
          />
          <View style={styles.labelSubtitleContainer}>
            <Text style={[styles.textButtonLabel, styles.textButtonLeftLabel]}>
              {'Edit'}
            </Text>
            <Text style={[styles.textButtonSubtitle, styles.textButtonLeftSubtitle]}>
              {'Modify details'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.buttonRightContainer, styles.buttonContainer]}
          onPress={props.onPressRightButton}
          activeOpacity={0.8}
        >
          <Ionicon
            name={'ios-filing'}
            size={24}
            color={Colors.INDIGO[700]}
          />
          <View style={styles.labelSubtitleContainer}>
            <Text style={[styles.textButtonLabel, styles.textButtonRightLabel]}>
              {'Add'}
            </Text>
            <Text style={[styles.textButtonSubtitle, styles.textButtonRightSubtitle]}>
              {'Insert Questions'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
};

// used in screens/CreateQuizScreen
// SectionList: renderItem component
// shows section details (name, type, etc.)
export class CreateQuizListItem extends React.Component {
  static propTypes = {
    index  : PropTypes.number,
    section: PropTypes.object,
    // events
    onPressSectionEdit  : PropTypes.func,
    onPressSectionAdd   : PropTypes.func,
    onPressSectionDelete: PropTypes.func,
  };
  
  static styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      color: Colors.GREY[900],
      fontWeight: '800',
      flex: 1,
      marginLeft: 7,
    },
    closeContainer: {
      aspectRatio: 1,
      width: 27,
      backgroundColor: Colors.RED[100],
      borderRadius: 27/2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelValueContainer: {
      marginBottom: 3,
    },
    textDescLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      fontWeight: '600',
      color: Colors.GREY[900],
    },
    textDescBody: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[800],
    },
    divider: {
      margin: 10,
    },
  });

  constructor(props){
    super(props);

    // wrap onPress handlers in debounce
    this._handleOnPressDelete      = debounce(this._handleOnPressDelete     , 750, {leading: true});
    this._handleOnPressLeftButton  = debounce(this._handleOnPressLeftButton , 750, {leading: true});
    this._handleOnPressRightButton = debounce(this._handleOnPressRightButton, 750, {leading: true});
  };

  _handleOnPressDelete = () => {
    const { index, onPressSectionDelete, section } = this.props;
    onPressSectionDelete && onPressSectionDelete({section, index});
  };

  _handleOnPressLeftButton = () => {
    const { index, onPressSectionEdit, section } = this.props;
    onPressSectionEdit && onPressSectionEdit({section, index});
  };

  _handleOnPressRightButton = () => {
    const { index, onPressSectionAdd, section } = this.props;
    onPressSectionAdd && onPressSectionAdd({section, index});
  };

  render(){
    const { styles } = CreateQuizListItem;
    const { section, ...props } = this.props;

    const sectionType   = section[QuizSectionKeys.sectionType         ] ?? 'N/A';
    const sectionTitle  = section[QuizSectionKeys.sectionTitle        ] ?? 'Title N/A';
    const sectionDesc   = section[QuizSectionKeys.sectionDesc         ] ?? 'Description N/A';
    const questionCount = section[QuizSectionKeys.sectionQuestionCount] ?? 0;

    // get the readable string of the section type
    const displaySectionType   = SectionTypeTitles[sectionType];
    const displayQuestionCount = `${questionCount} ${Helpers.plural('item', questionCount)}`;

    return(
      <ListCard>
        <View style={styles.titleContainer}>
          <ListItemBadge
            value={(props.index + 1)}
            size={19}
            color={Colors.INDIGO['A200']}
          />
          <Text style={styles.textTitle}>
            {sectionTitle}
          </Text>
          <TouchableOpacity 
            style={styles.closeContainer}
            onPress={this._handleOnPressDelete}
            activeOpacity={0.75}
          >
            <Ionicon
              name={'ios-close'}
              size={28}
              color={Colors.RED[700]}
            />
          </TouchableOpacity>
        </View>
        <TableLabelValue
          containerStyle={styles.labelValueContainer}
          labelValueMap={[
            ['Type'     , displaySectionType  ],
            ['Questions', displayQuestionCount],
          ]}
        />
        <Text numberOfLines={3}>
          <Text style={styles.textDescLabel}>
            {'Description: '}
          </Text>
          <Text style={styles.textDescBody}>
            {sectionDesc}
          </Text>
        </Text>
        <Divider style={styles.divider}/>
        <LeftRightButton
          onPressLeftButton ={this._handleOnPressLeftButton }
          onPressRightButton={this._handleOnPressRightButton}
        />
      </ListCard>
    );
  };
};