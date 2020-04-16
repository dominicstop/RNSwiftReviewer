import React from 'react';
import { StyleSheet } from 'react-native';

import { INSET_TOP } from 'app/src/constants/UIValues';
import { NavHeader } from './NavHeader';

export class ScreenHeaderOverlay extends React.PureComponent {
  render(){
    const { containerStyle, ...props } = this.props;

    return(
      <NavHeader 
        containerStyle={[styles.rootContainer, containerStyle]}
        {...props}
      >
        {this.props.children}
      </NavHeader>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: INSET_TOP,
    // float top
    position: 'absolute',
    top: 0,
    left: 0, 
    right: 0,
  },
});