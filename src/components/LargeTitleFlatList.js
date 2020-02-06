import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import propTypes from 'prop-types';


export class LargeTitleFlatList extends React.PureComponent {

  render(){
    const { ...flatListProps } = this.props;

    return(
      <FlatList 
        {...flatListProps}

      />
    );
  };
};