import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { BlurView } from "@react-native-community/blur";
import { ModalDragIndicator } from 'app/src/components/Modal/ModalDragIndicator';

import * as Colors from 'app/src/constants/Colors';
import { MODAL_HEADER_HEIGHT_COMPACT } from 'app/src/constants/UIValues';


const styles = StyleSheet.create({
  rootContainer: {
    height: MODAL_HEADER_HEIGHT_COMPACT,
    //float top
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
});

export class ModalHeaderCompact extends React.PureComponent {
  render(){
    return(
      <View style={styles.rootContainer}>
        <BlurView
          style={styles.blurBackground}
          blurAmount={75}
          blurType={'light'}
        />
        <View style={styles.indicatorContainer}>
          <ModalDragIndicator/>
        </View>
      </View>
    );
  };
};