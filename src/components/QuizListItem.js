import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit } from 'react-native-typography';
import { Divider } from 'react-native-elements';

import { ListCard } from 'app/src/components/ListCard';
import { ListItemBadge } from 'app/src/components/ListItemBadge';
import { GREY } from 'app/src/constants/Colors';

export class QuizListItem extends React.Component {
  static styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      flex: 1,
      marginLeft: 7,
    },
    textDescription: {
      ...iOSUIKit.bodyObject,
      color: GREY[800],
      marginTop: 3,
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

  };

  render(){
    const { styles } = QuizListItem;

    return(
      <ListCard>
        <View style={styles.titleContainer}>
          <ListItemBadge
            value={1}
          />
          <Text 
            style={styles.textTitle}
            numberOfLines={1}
          >
            {'Test'}
          </Text>
        </View>
        <Text 
          style={styles.textDescription}
          numberOfLines={3}
        >
          <Text style={styles.textDescriptionLabel}>
            {'Description: '}
          </Text>
          {'Etiam porta sem malesuada magna mollis euismod.'}
        </Text>
        <Divider style={styles.divider}/>
      </ListCard>
    );
  };
};