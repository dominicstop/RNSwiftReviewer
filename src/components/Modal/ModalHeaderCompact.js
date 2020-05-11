import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  dragIndicator: {
    width: 40,
    height: 6,
    backgroundColor: Colors.BLUE[900],
    borderRadius: 10,
    opacity: 0.25,
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
          <Animatable.View 
            style={styles.dragIndicator}
            animation={'pulse'}
            duration={2000}
            iterationCount={'infinite'}
            iterationDelay={2000}
            useNativeDriver={true}
          />
        </View>
      </View>
    );
  };
};