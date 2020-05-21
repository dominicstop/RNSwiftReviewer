import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { MODAL_FOOTER_HEIGHT, INSET_BOTTOM } from 'app/src/constants/UIValues';

import * as Animatable from 'react-native-animatable';

import Ionicon        from '@expo/vector-icons/Ionicons';
import debounce       from "lodash/debounce";
import LinearGradient from 'react-native-linear-gradient';

import { iOSUIKit } from 'react-native-typography';

import * as Colors from 'app/src/constants/Colors';


const RADIUS = 13;

// Used in modalFooter as children
// Shows a accept/decline button
export class ModalFooterButton extends React.PureComponent {
  static propTypes = {
    buttonLeftTitle    : PropTypes.string,
    buttonLeftSubtitle : PropTypes.string,
    buttonRightTitle   : PropTypes.string,
    buttonRightSubtitle: PropTypes.string,
    onPressButtonLeft  : PropTypes.func,
    onPressButtonRight : PropTypes.func,
  };

  static defaultProps = {
    buttonRightTitle   : 'Cancel',
    buttonRightSubtitle: 'Close this modal',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      height: MODAL_FOOTER_HEIGHT,
    },
    buttonWrapper: {
      flex: 1,
      flexDirection: 'row',
      marginHorizontal: 8,
      marginTop: 12,
      marginBottom: (12 + INSET_BOTTOM),
      //shadow
      shadowColor: "#000",
      shadowOpacity: 0.4,
      shadowRadius: 3,
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
      opacity: 0.9,
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
      marginTop: -2,
      color: 'rgba(255,255,255,0.75)',
    },
  });

  constructor(props){
    super(props);

    this._handleOnPressButtonLeft  = debounce(this._handleOnPressButtonLeft , 750, {leading: true});
    this._handleOnPressButtonRight = debounce(this._handleOnPressButtonRight, 750, {leading: true});
  };

  _handleOnPressButtonLeft = () => {
    const { onPressButtonLeft } = this.props;

    const ref = this.rootContainerRef;
    ref && ref.pulse(500);

    onPressButtonLeft && onPressButtonLeft();
  };

  _handleOnPressButtonRight = () => {
    const { onPressButtonRight } = this.props;

    console.log('close');

    const ref = this.rootContainerRef;
    ref && ref.pulse(500);

    onPressButtonRight && onPressButtonRight();
  };

  render(){
    const { styles } = ModalFooterButton;
    const props = this.props;

    return(
      <Animatable.View 
        style={styles.rootContainer}
        ref={r => this.rootContainerRef = r}
        animation={'pulse'}
        duration={750}
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
              colors={[Colors.BLUE.A700, Colors.BLUE.A400]}
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
              colors={[Colors.RED.A700, Colors.RED.A400]}
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
                  {props.buttonRightTitle}
                </Text>
                <Text style={styles.textButtonSubtitle}>
                  {props.buttonRightSubtitle}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };
};




