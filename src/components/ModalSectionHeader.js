import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import * as Colors from '../constants/Colors';


const styles = StyleSheet.create({
  rootContainer: {
    borderColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  titleIconContainer: {
    width: 23,
  },
  titleContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
    marginTop: 7,
  },
  textTitle: {
    ...iOSUIKit.subheadEmphasizedObject,
    fontSize: 18,
    textAlignVertical: 'center',
    color: Colors.GREY[900]
  },
  textSubtitle: {
    ...iOSUIKit.subheadObject,
    color: Colors.GREY[700],
    marginHorizontal: 10,
    marginBottom: 7,
  },
});

export class ModalSectionHeader extends React.PureComponent {
  static propTypes = {
    title    : PropTypes.string,
    subtitle : PropTypes.string,
    titleIcon: PropTypes.element,
  };

  static defaultProps = {
    title: 'Section Title',
  };

  render(){
    const props = this.props;
    
    const rootContainerStyle = {
      ...(props.showTopBorder && {
        borderTopWidth: 1,
      }),
    };

    const titleContainerStyle = {
      ...(!props.subtitle && {
        marginVertical: 8,
      }),
    };

    const textTitleStyle = {
      ...(props.titleIcon && {
        marginLeft: 7
      }),
    };
    
    return(
      <View style={[styles.rootContainer, rootContainerStyle]}>
        <BlurView
          style={styles.blurBackground}
          blurType={'light'}
        />
        <View style={styles.background}/>
        <View style={[styles.titleContainer, titleContainerStyle]}>
          <View style={styles.titleIconContainer}>
            {props.titleIcon}
          </View>
          <Text style={[styles.textTitle, textTitleStyle]}>
            {props.title}
          </Text>
        </View>
        {props.subtitle && (
          <Text style={styles.textSubtitle}>
            {props.subtitle}
          </Text>
        )}
      </View>
    );
  };
};