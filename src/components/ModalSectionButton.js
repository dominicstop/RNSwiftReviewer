import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import throttle from "lodash/throttle";
import { iOSUIKit } from 'react-native-typography';

import { ModalSection } from 'app/src/components/ModalSection';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

export class ModalSectionButton extends React.PureComponent {
  static propTypes = {
    label        : PropTypes.string ,
    leftIcon     : PropTypes.any    ,
    isDestructive: PropTypes.bool   ,
  };

  static defaultProps = {
    isDestructive: false,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      paddingVertical: 12,
    },
    buttonInsertContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonInsertText: {
      ...iOSUIKit.bodyEmphasizedObject,
    },
  });

  constructor(props){
    super(props);

    this._handleOnPress = throttle(this._handleOnPress, 750);
  };

  _handleOnPress = () => {
    const { onPress } = this.props;
    onPress && onPress();
  };

  render(){
    const { styles } = ModalSectionButton;
    const { leftIcon, label, isDestructive, containerStyle, ...props } = this.props;

    const iconColor = (isDestructive
      ? Colors.RED[600]
      : Colors.BLUE.A400
    );

    const textColor = (isDestructive
      ? Colors.RED[600]
      : Colors.BLUE.A700
    );

    const textStyle = {
      color: textColor,
      ...(leftIcon && { marginLeft: 10 })
    };
    
    return(
      <ModalSection
        containerStyle={[styles.rootContainer, containerStyle]}
        hasPadding={false}
        {...props}
      >
        <TouchableOpacity 
          style={styles.buttonInsertContainer}
          onPress={this._handleOnPress}
        >
          {leftIcon && (
            React.cloneElement(leftIcon, {color: iconColor})
          )}
          <Text style={[styles.buttonInsertText, textStyle]}>
            {label}
          </Text>
        </TouchableOpacity>
      </ModalSection>
    );
  };
};