import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { iOSUIKit, sanFranciscoWeights } from 'react-native-typography';

import { ListItemBadge   } from 'app/src/components/ListItemBadge';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

import { QuizSectionKeys } from 'app/src/constants/PropKeys';
import { SectionTypes, SectionTypeTitles } from 'app/src/constants/SectionTypes';


export class ViewQuizSectionList extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: 'rgba(255,255,255,0.6)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textTitle: {
      ...iOSUIKit.subheadObject,
      ...sanFranciscoWeights.semibold,
      fontSize: (iOSUIKit.subheadEmphasizedObject.fontSize + 2),
      flex: 1,
      marginLeft: 7,
      textAlignVertical: 'center',
    },
    textDescription: {
      ...iOSUIKit.subheadObject,
      marginTop: 3,
      color: Colors.GREY[900],
    },
  });

  render(){
    const { styles } = ViewQuizSectionList;
    const { index, ...props } = this.props;

    const title = props[QuizSectionKeys.sectionTitle] ?? 'N/A';
    const desc  = props[QuizSectionKeys.sectionDesc ] ?? 'N/A';
    const type  = props[QuizSectionKeys.sectionType ] ?? 'N/A';

    const questionCount = props[QuizSectionKeys.sectionQuestionCount] ?? 0;
    
    const textType  = SectionTypeTitles[type];
    const textCount = `${questionCount} ${Helpers.plural('item', questionCount)}`;

    return (
      <View style={styles.rootContainer}>
        <View style={styles.titleContainer}>
          <ListItemBadge
            size={20}
            value={(index + 1)}
            textStyle={{fontWeight: '900'}}
            color={Colors.BLUE[100]}
            textColor={Colors.BLUE.A700}
          />
          <Text style={styles.textTitle}>
            {title}
          </Text>
        </View>
        <TableLabelValue
          containerStyle={{marginTop: 3}}
          textDetailLabelStyle={{flex: 0, marginRight: 5}}
          labelValueMap={[
            ['Type:'    , textType ],
            ['Sections:', textCount],
          ]}
        />
        <Text style={styles.textDescription}>
          <Text style={iOSUIKit.subheadEmphasized}>
            {'Description: '}
          </Text>
          {desc}
        </Text>
      </View>
    );
  };
};