import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit         } from 'react-native-typography';
import { Divider          } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { ListCard        } from 'app/src/components/ListCard';
import { ListItemBadge   } from 'app/src/components/ListItemBadge';
import { TableLabelValue } from 'app/src/components/TableLabelValue';

import { QuizSectionKeys } from 'app/src/constants/PropKeys';

import { SectionTypeTitles } from 'app/src/models/QuizSectionModel';



export class CreateQuizListItem extends React.Component {
  static propTypes = {
    // note: QuizSectionKeys is passed down as props
    index: PropTypes.number,
    // events
    onPressSectionItem: PropTypes.func,
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
      marginLeft: 7,
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
  
  _handleOnPress = () => {
    const { section, index, onPressSectionItem } = this.props;
    onPressSectionItem && onPressSectionItem({section, index});
  };

  render(){
    const { styles } = CreateQuizListItem;
    const props = this.props;


    const sectionType   = props[QuizSectionKeys.sectionType         ];
    const sectionTitle  = props[QuizSectionKeys.sectionTitle        ];
    const sectionDesc   = props[QuizSectionKeys.sectionDesc         ];
    const questionCount = props[QuizSectionKeys.sectionQuestionCount];

    // get the readable string of the section type
    const displaySectionType   = SectionTypeTitles[sectionType];
    const displayQuestionCount = `${questionCount} ${Helpers.plural('item', questionCount)}`;

    return(
      <ListCard>
        <TouchableOpacity
          onPress={this._handleOnPress}
          activeOpacity={0.5}
        >
          <View style={styles.titleContainer}>
            <ListItemBadge
              value={(props.index + 1)}
              size={19}
              color={Colors.INDIGO['A200']}
            />
            <Text style={styles.textTitle}>
              {sectionTitle}
            </Text>
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
        </TouchableOpacity>
      </ListCard>
    );
  };
};