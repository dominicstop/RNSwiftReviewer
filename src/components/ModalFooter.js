import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import { MODAL_FOOTER_HEIGHT, MODAL_BOTTOM_PADDING } from 'app/src/constants/UIValues';
import { BLUE, INDIGO, GREY } from '../constants/Colors';


const styles = StyleSheet.create({
  rootContainer: {
    height: (MODAL_FOOTER_HEIGHT + MODAL_BOTTOM_PADDING),
    //float top
    position: 'absolute',
    bottom: -MODAL_BOTTOM_PADDING,
    left: 0,
    right: 0,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    //fill space
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: MODAL_BOTTOM_PADDING,
  },
});

export class ModalFooter extends React.Component {
  render(){
    const { headerIcon, ...props } = this.props;
    
    return(
      <View style={styles.rootContainer}>
        <BlurView
          style={styles.blurBackground}
          blurType={'regular'}
        />
        <View style={styles.background}/>
        {this.props.children}
      </View>
    );
  };
};