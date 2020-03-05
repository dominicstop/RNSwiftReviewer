import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { MODAL_FOOTER_HEIGHT, MODAL_BOTTOM_PADDING, INSET_BOTTOM } from 'app/src/constants/UIValues';

import * as Animatable from 'react-native-animatable';
import LinearGradient  from 'react-native-linear-gradient';
import Ionicon         from '@expo/vector-icons/Ionicons';

import { iOSUIKit } from 'react-native-typography';

import { GREY, PURPLE, BLUE, INDIGO, RED } from 'app/src/constants/Colors';

const RADIUS = 12;
const MARGIN_VERTICAL   = 10;
const MARGIN_HORIZONTAL = 7;

export class ModalFooterButton extends React.PureComponent {
  static propTypes = {
    buttonLeftTitle   : PropTypes.string,
    buttonLeftSubtitle: PropTypes.string,
    onPressButtonLeft : PropTypes.func,
    onPressButtonRight: PropTypes.func,
  };

  static defaultProps = {

  };

  static styles = StyleSheet.create({
    rootContainer: {
      height: MODAL_FOOTER_HEIGHT,
    },
    buttonWrapper: {
      flex: 1,
      flexDirection: 'row',
      marginHorizontal: 7,
      marginTop: 10,
      marginBottom: (10 + INSET_BOTTOM),
      //shadow
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    leftButtonGradient: {
      flex: 1,
      borderTopLeftRadius   : RADIUS,
      borderBottomLeftRadius: RADIUS,
    },
    rightButtonGradient: {
      flex: 1,
      borderTopRightRadius   : RADIUS,
      borderBottomRightRadius: RADIUS,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    buttonIcon: {
      opacity: 0.8,
      //glow
      shadowColor: "white",
      shadowOpacity: 0.25,
      shadowRadius: 3,
    },
    buttonTextContainer: {
      marginLeft: 10,
    },
    textButtonTitle: {
      ...iOSUIKit.subheadEmphasizedObject,
      color: 'white',
      //glow
      shadowColor: "white",
      shadowOpacity: 0.25,
      shadowRadius: 3,
    },
    textButtonSubtitle: {
      ...iOSUIKit.subheadObject,
      color: 'rgba(255,255,255,0.75)',
    },
  });

  _handleOnPressButtonLeft = () => {
    const { onPressButtonLeft } = this.props;
    this.rootContainerRef.pulse(500);
    onPressButtonLeft && onPressButtonLeft();
  };

  _handleOnPressButtonRight = () => {
    const { onPressButtonRight } = this.props;
    this.rootContainerRef.pulse(500);
    onPressButtonRight && onPressButtonRight();
  };

  render(){
    const { styles } = ModalFooterButton;
    const props = this.props;

    return(
      <Animatable.View 
        style={styles.rootContainer}
        ref={r => this.rootContainerRef = r}
        animation={'fadeInUp'}
        duration={300}
        delay={200}
        useNativeDriver={true}
      >
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={0.8}
            onPress={this._handleOnPressButtonLeft}
          >
            <LinearGradient
              style={[styles.leftButtonGradient, styles.buttonContainer]}
              colors={[BLUE.A700, BLUE.A400]}
              start={{ x: 0, y: 1 }}
              end  ={{ x: 1, y: 1 }}
            >
              <Ionicon
                style={styles.buttonIcon}
                name={'ios-checkmark-circle'}
                color={'white'}
                size={25}
              />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.textButtonTitle}>
                  {props.buttonLeftTitle}
                </Text>
                <Text style={styles.textButtonSubtitle}>
                  {props.buttonLeftSubtitle}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{flex: 1}}
            activeOpacity={0.8}
            onPress={this._handleOnPressButtonRight}
          >
            <LinearGradient
              style={[styles.rightButtonGradient, styles.buttonContainer]}
              colors={[RED.A700, RED.A400]}
              start={{ x: 0, y: 1 }}
              end  ={{ x: 1, y: 1 }}
            >
              <Ionicon
                style={styles.buttonIcon}
                name={'ios-close-circle'}
                color={'white'}
                size={25}
              />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.textButtonTitle}>
                  {'Cancel'}
                </Text>
                <Text style={styles.textButtonSubtitle}>
                  {'Close this modal'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };
};




