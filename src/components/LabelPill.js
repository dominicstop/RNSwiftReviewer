import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit } from 'react-native-typography';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';


export class LabelPill extends React.PureComponent {
  static propTypes = {
    textLabel: PropTypes.string,
    textValue: PropTypes.string,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      borderRadius: 25,
      overflow: 'hidden',
      backgroundColor: Colors.BLUE[900],
      alignSelf: 'center',
      alignItems: 'center',
    },
    textLeft: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      fontSize: 14,
      paddingLeft: 12,
      paddingRight: 10,
      paddingVertical: 2,
      fontWeight: '600',
      color: 'white',
    },
    textRight: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      fontSize: 14,
      paddingLeft: 7,
      paddingRight: 10,
      paddingVertical: 3,
      fontWeight: '800',
      textAlign: 'center',
      backgroundColor: Colors.BLUE.A700,
    },
  });

  render(){
    const { styles } = LabelPill;
    const props = this.props;

    return(
      <View style={[styles.rootContainer, props.containerStyle]}>
        <Text style={styles.textLeft}>
          {props.textLabel}
        </Text>
        <Text style={[styles.textRight, props.textRightStyle]}>
          {props.textValue}
        </Text>
      </View>
    );
  };
};