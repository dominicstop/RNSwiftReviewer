import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import { MODAL_HEADER_HEIGHT } from 'app/src/constants/UIValues';
import { BLUE, INDIGO, GREY } from '../constants/Colors';


const styles = StyleSheet.create({
  rootContainer: {
    height: MODAL_HEADER_HEIGHT,
    //float top
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  headerWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    paddingTop: 7,
    borderBottomColor: 'rgba(0,0,0,0.15)',
    borderBottomWidth: 1,
  },
  dragIndicator: {
    width: 40,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
  },
  headerContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40/2,
    backgroundColor: INDIGO.A700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    shadowColor: 'white',
    shadowRadius: 7,
    shadowOpacity: 0.6,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textTitle: {
    ...iOSUIKit.title3EmphasizedObject,
    fontWeight: '800',
    color: INDIGO[1000],
  },
  textSubtitle: {
    ...iOSUIKit.subheadObject,
    color: GREY[800],
  },
});

export class ModalHeader extends React.Component {
  static propTypes = {
    title   : PropTypes.string,
    subtitle: PropTypes.string,
  };

  static defaultProps = {
    title   : 'Title N/A',
    subtitle: 'Subtitle N/A',
  };

  render(){
    const { headerIcon, ...props } = this.props;

    const LeftHeaderIcon = (
      <View style={styles.iconContainer}>
        <View style={styles.iconStyle}>
          {headerIcon}
        </View>
      </View>
    );

    return(
      <View style={styles.rootContainer}>
        <BlurView
          style={styles.blurBackground}
          blurType={'regular'}
        />
        <View style={styles.headerWrapper}>
          <Animatable.View 
            style={styles.dragIndicator}
            animation={'pulse'}
            duration={2000}
            iterationCount={'infinite'}
            iterationDelay={2000}
            useNativeDriver={true}
          />
          <View style={styles.headerContainer}>
            {LeftHeaderIcon}
            <View style={styles.headerTextContainer}>
              <Text style={styles.textTitle}>
                {props.title}
              </Text>
              <Text style={styles.textSubtitle}>
                {props.subtitle}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
};