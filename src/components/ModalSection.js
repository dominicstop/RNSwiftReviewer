import React from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
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
      ...(showBorderTop && { borderTopWidth: 1 }),
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