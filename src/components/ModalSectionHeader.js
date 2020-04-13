import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import * as Colors from '../constants/Colors';


const styles = StyleSheet.create({
  rootContainer: {
    borderColor: Colors.GREY[400],
    borderBottomWidth: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.7,
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
    marginTop: 7,
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
    marginBottom: 7,
  },
});

// used in conjuction w/ components/ModalSection
// used inside of ModalBackground
// displays an icon + title/subtitle w/ a blurred bg
export class ModalSectionHeader extends React.PureComponent {
  static propTypes = {
    title    : PropTypes.string,
    subtitle : PropTypes.string,
    titleIcon: PropTypes.element,
  };

  static defaultProps = {
    title: 'Section Title',
    showTopBorder: true,
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

    const titleSubtitleContainerStyle = {
      ...(props.titleIcon && {
        marginLeft: 12,
      }),
    };
    
    return(
      <View style={[styles.rootContainer, rootContainerStyle, props.containerStyle]}>
        <BlurView
          style={styles.blurBackground}
          blurType={'light'}
        />
        <View style={styles.background}/>
        <View style={[styles.titleContainer, titleContainerStyle]}>
          <Animatable.View 
            style={styles.titleIconContainer}
            animation={'pulse'}
            duration={10000}
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
    );
  };
};