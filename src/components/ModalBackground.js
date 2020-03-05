import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import { MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT } from 'app/src/constants/UIValues';

import { VibrancyView, BlurView } from "@react-native-community/blur";


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
    bottom: MODAL_FOOTER_HEIGHT,
  },
  background: {
    backgroundColor: 'rgba(250,250,250,0.4)',
    //fill space
    position: 'absolute',
    top: MODAL_HEADER_HEIGHT,
    left: 0,
    right: 0,
    bottom: MODAL_FOOTER_HEIGHT,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export class ModalBackground extends React.PureComponent {
  static propTypes = {
    modalHeader: PropTypes.element,
  };

  render(){
    const { modalHeader, modalFooter, overlay } = this.props;

    return(
      <View style={styles.rootContainer}>
        <BlurView 
          style={styles.blurBackground}
          blurType={'light'}
          blurAmount={100}
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
        {modalFooter}
        {overlay}
      </View>
    );
  };
};