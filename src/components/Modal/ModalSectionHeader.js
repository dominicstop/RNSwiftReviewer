import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import * as Colors from 'app/src/constants/Colors';
import { BORDER_WIDTH } from 'app/src/constants/UIValues';

const OVERFLOW_HEIGHT = 200;


const styles = StyleSheet.create({
  topOverflow: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    left: 0,
    right: 0,
    top: -OVERFLOW_HEIGHT,
    height: OVERFLOW_HEIGHT,
  },
  rootContainer: {
    top: -BORDER_WIDTH,
    borderColor: Colors.GREY[400],
    borderBottomWidth: BORDER_WIDTH,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  titleIconContainer: {
  },
  titleSubtitleContainer: {
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  textTitle: {
    ...iOSUIKit.subheadEmphasizedObject,
    fontSize: 18,
    textAlignVertical: 'center',
    fontWeight: '700',
    color: Colors.GREY[900]
  },
  textSubtitle: {
    ...iOSUIKit.subheadObject,
    color: Colors.GREY[700],
  },
});

// used in conjuction w/ components/ModalSection
// used inside of ModalBody
// displays an icon + title/subtitle w/ a blurred bg
export class ModalSectionHeader extends React.PureComponent {
  static propTypes = {
    title        : PropTypes.string,
    subtitle     : PropTypes.string,
    titleIcon    : PropTypes.element,
    topOverflow  : PropTypes.bool,
    showTopBorder: PropTypes.bool,
  };

  static defaultProps = {
    title: 'Section Title',
    showTopBorder: true,
    topOverflow: false,
  };

  render(){
    const props = this.props;
    
    const rootContainerStyle = {
      ...(props.showTopBorder && {
        borderTopWidth: BORDER_WIDTH,
      }),
    };

    const titleContainerStyle = {
      ...(!props.subtitle && {
        marginVertical: 8,
      }),
    };

    const titleSubtitleContainerStyle = {
      ...(props.titleIcon && {
        marginLeft: 12,
      }),
    };
    
    return(
      <Fragment>
        {props.topOverflow && (
          <View style={styles.topOverflow}/>
        )}
        <View style={[styles.rootContainer, rootContainerStyle, props.containerStyle]}>
          <BlurView
            style={styles.blurBackground}
            blurAmount={50}
            blurType={'light'}
          />
          <View style={styles.background}/>
          <View style={[styles.titleContainer, titleContainerStyle]}>
            <Animatable.View 
              style={styles.titleIconContainer}
              animation={'pulse'}
              duration={7500}
              iterationCount={'infinite'}
              delay={1000}
              useNativeDriver={true}
            >
              {React.cloneElement(props.titleIcon, 
                { color: Colors.INDIGO.A400 }
              )}
            </Animatable.View>
            <View style={[styles.titleSubtitleContainer, titleSubtitleContainerStyle]}>
              <Text style={styles.textTitle}>
                {props.title}
              </Text>
              {props.subtitle && (
                <Text style={styles.textSubtitle}>
                  {props.subtitle}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Fragment>
    );
  };
};