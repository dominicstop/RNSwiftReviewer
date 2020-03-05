import React from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  rootContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
  },
});

export class ModalSection extends React.PureComponent {
  static propTypes = {
    showBorderTop: PropTypes.bool,
  };

  static defaultProps = {
    showBorderTop: true,
  };

  render(){
    const { showBorderTop } = this.props;

    const containerStyle = {
      ...(showBorderTop && { borderTopWidth: 1 }),
    };

    return(
      <View style={[styles.rootContainer, containerStyle]}>
        {this.props.children}
      </View>
    );
  };
};