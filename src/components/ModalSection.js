import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Colors from 'app/src/constants/Colors';
import { BORDER_WIDTH } from 'app/src/constants/UIValues';


const styles = StyleSheet.create({
  rootContainer: {
    top: -BORDER_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderColor: Colors.GREY[500],
    borderBottomWidth: BORDER_WIDTH,
  },
});

// used as children in: components/ModalBackground
// used for displaying a ModalBackground item
// Wraps element and adds a bg + border
export class ModalSection extends React.PureComponent {
  static propTypes = {
    showBorderTop: PropTypes.bool,
  };

  static defaultProps = {
    showBorderTop  : true,
    hasMarginBottom: true,
    hasPadding     : true,
    paddingBottom  : 15,
    marginBottom   : 20,
    marginTop      : 0 ,
  };

  render(){
    const { showBorderTop, ...props } = this.props;

    const containerStyle = {
      marginTop: props.marginTop,
      ...(showBorderTop && { 
        borderTopWidth: BORDER_WIDTH
      }),
      ...(props.hasMarginBottom && { 
        marginBottom: props.marginBottom,
      }),
      ...(props.hasPadding && {
        paddingBottom: props.paddingBottom,
        paddingHorizontal: 10,
        paddingTop: 12,
      }),
    };

    return(
      <View style={[styles.rootContainer, containerStyle, props.containerStyle]}>
        {this.props.children}
      </View>
    );
  };
};