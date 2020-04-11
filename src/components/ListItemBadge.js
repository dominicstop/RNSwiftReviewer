import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { INDIGO } from 'app/src/constants/Colors';

export class ListItemBadge extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '500',
    },
  });

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    // appearance props
    size          : PropTypes.number,
    color         : PropTypes.string,
    textColor     : PropTypes.string,
    adjustFontSize: PropTypes.bool  ,
    initFontSize  : PropTypes.number,
    diffFontSize  : PropTypes.number,
    // styles props
    containerStyle: PropTypes.object,
    textStyle     : PropTypes.object,
  };

  static defaultProps = {
    size          : 18         ,
    color         : INDIGO.A700,
    textColor     : 'white'    ,
    adjustFontSize: true       ,
    initFontSize  : 13         ,
    diffFontSize  : 2          ,
  };

  render(){
    const { styles } = ListItemBadge;
    const { size, ...props } = this.props;

    const value       = (props.value ?? 1) + '';
    const charCount   = (value.length - 1);
    const fontSizeAdj = (props.diffFontSize * charCount);

    const textStyle = {
      color: props.textColor,
      ...(props.adjustFontSize && {
        fontSize: (props.initFontSize - fontSizeAdj)
      }),
    };

    const badgeContainer = {
      width : size,
      height: size,
      borderRadius   : (size / 2),
      backgroundColor: props.color,
      marginRight: props.marginRight,
    };

    return(
      <View style={[styles.rootContainer, badgeContainer, props.containerStyle]}>
        <Text 
          style={[styles.text, textStyle, props.textStyle]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    );
  };
};