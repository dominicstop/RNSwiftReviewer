import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import { MODAL_HEADER_HEIGHT, MODAL_BOTTOM_PADDING } from 'app/src/constants/UIValues';
import { ModalHeader } from 'app/src/components/ModalHeader';

import { VibrancyView } from "@react-native-community/blur";


const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  blurBackground: {
    //fill space
    position: 'absolute',
    top: MODAL_HEADER_HEIGHT,
    left: 0,
    right: 0,
    bottom: -MODAL_BOTTOM_PADDING,
  },
  background: {
    backgroundColor: 'rgba(240,240,240,0.5)',
    //fill space
    position: 'absolute',
    top: MODAL_HEADER_HEIGHT,
    left: 0,
    right: 0,
    bottom: -MODAL_BOTTOM_PADDING,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  extraFooter: {
    left: 0,
    right: 0,
    bottom: -100,
    height: 100,
    backgroundColor: 'white',
  },
});

export class ModalBackground extends React.PureComponent {
  static propTypes = {
    modalHeader: PropTypes.element,
  };

  render(){
    const { modalHeader } = this.props;

    return(
      <View style={styles.rootContainer}>
        <VibrancyView 
          style={styles.blurBackground}
          blurType={'regular'}
        />
        <View style={styles.background}/>
        <View style={styles.scrollViewContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentInset={{top: MODAL_HEADER_HEIGHT}}
          >
            {this.props.children}
          </ScrollView>
        </View>
        {modalHeader}
      </View>
    );
  };
};