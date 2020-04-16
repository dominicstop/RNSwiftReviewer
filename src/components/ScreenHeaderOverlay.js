import React from 'react';
import { StyleSheet, View } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { BlurView } from "@react-native-community/blur";

import { INSET_TOP    } from 'app/src/constants/UIValues';
import { HeaderValues } from 'app/src/constants/HeaderValues';
import { NavHeader } from './NavHeader';

export class ScreenHeaderOverlay extends React.PureComponent {
  render(){
    return(
      <NavHeader containerStyle={styles.rootContainer}>

      </NavHeader>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: INSET_TOP,
    // float top
    position: 'absolute',
    top: 0,
    left: 0, 
    right: 0,
  },
});