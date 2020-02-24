import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Ionicons } from '@expo/vector-icons';

import { iOSUIKit } from 'react-native-typography';

import { BLUE } from 'app/src/constants/Colors';


export class ListSortButton extends React.Component {
  static propTypes = {
    isAscending: PropTypes.bool  ,
    sortLabel  : PropTypes.string,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      overflow: 'hidden',
      backgroundColor: BLUE[600],
      borderRadius: 13,
      borderColor: BLUE[800],
      borderWidth: 1,
    },
    leftContainer: {
      flexDirection: 'row',
      paddingVertical: 2,
      paddingLeft: 10,
      paddingRight: 10,
      alignItems: 'center',
    },
    rightContainer: {
      flexDirection: 'row',
      paddingVertical: 1,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: BLUE[800],
      alignItems: 'center',
    },
    textSortLabel: {
      ...iOSUIKit.subheadObject,
      color: 'white',
      marginLeft: 7,
    },
    textSortType: {
      ...iOSUIKit.subheadObject,
      fontWeight: '700',
      color: 'white',
    },
  });

  render(){
    const { styles } = ListSortButton;
    const props = this.props;

    const name = (props.isAscending
      ? 'md-arrow-up' : 'md-arrow-down'
    );

    return(
      <TouchableOpacity 
        style={[styles.rootContainer, props.containerStyle]}
        {...props}
      >
        <View style={styles.leftContainer}>
          <Ionicons
            style={{marginTop: 2}}
            size={17}
            color={'white'}
            {...{name}}
          />
          <Text style={styles.textSortLabel}>
            {'Sort'}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.textSortType}>
            {`By ${props.sortLabel ?? 'None'}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
};