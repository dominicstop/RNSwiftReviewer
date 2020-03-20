import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { BlurView } from "@react-native-community/blur";

import { MODAL_FOOTER_HEIGHT, MODAL_BOTTOM_PADDING } from 'app/src/constants/UIValues';


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

// Used in ModalBackground props: modalFooter
// accepts ModalFooterButton as children
export class ModalFooter extends React.PureComponent {
  render(){
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