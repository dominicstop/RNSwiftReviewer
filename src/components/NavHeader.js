import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { VibrancyView } from "@react-native-community/blur";

import { HeaderValues } from 'app/src/constants/HeaderValues';
import { INDIGO, BLUE } from 'app/src/constants/Colors';


export class NavHeader extends Component {
  static styles = StyleSheet.create({
    rootContainer: {
      width: '100%',
      height: HeaderValues.getHeaderHeight(true),
    },
    blurBackground: {
      ...StyleSheet.absoluteFillObject,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.8,
    },
  });

  render() {
    const { styles } = NavHeader;
    const props = this.props;

    return (
      <View style={[styles.rootContainer, props.containerStyle]}>
        <VibrancyView
          style={styles.blurBackground}
          blurType={"light"}
          intensity={100}
        />
        <LinearGradient
          style={[styles.background]}
          colors={[INDIGO.A700, BLUE.A700]}
          start={{x: 0, y: 1}} 
          end  ={{x: 1, y: 0}}
        />
        {props.children}
      </View>
    );
  };
};