import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

export class ListCard extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      marginHorizontal: 10,
      marginTop: 15,
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 12,
      borderRadius: 10,
      //shadow style
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  });

  render(){
    const { styles } = ListCard;

    return(
      <View style={styles.rootContainer}>
        {this.props.children}
      </View>
    );
  };
};