import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit         } from 'react-native-typography';
import { Divider          } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { ListCard      } from 'app/src/components/ListCard';
import { ListItemBadge } from 'app/src/components/ListItemBadge';

import { QuizKeys } from 'app/src/models/QuizModel';


export class CreateQuizListItem extends React.Component {
  static propTypes = {
    section : PropTypes.object,
    index   : PropTypes.number,
    // events
    onPressSectionItem: PropTypes.func,
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
  
  _handleOnPress = () => {
    const { section, index, onPressSectionItem } = this.props;
    onPressSectionItem && onPressSectionItem({section, index});
  };

  render(){
    const { styles } = CreateQuizListItem;
    const { section, index } = this.props;

    const description = section?.[''] ?? '';

    return(
      <ListCard>
        <TouchableOpacity
          onPress={this._handleOnPress}
          activeOpacity={0.5}
        >

          <Divider style={styles.divider}/>

        </TouchableOpacity>
      </ListCard>
    );
  };
};