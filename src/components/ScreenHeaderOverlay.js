import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';

import { NavHeader } from 'app/src/components/NavHeader';

import { INSET_TOP    } from 'app/src/constants/UIValues';
import { HeaderValues } from 'app/src/constants/HeaderValues';

const headerHeight =  HeaderValues.getHeaderHeight(false);


export class ScreenHeaderOverlay extends React.PureComponent {
  render(){
    const { containerStyle, ...props } = this.props;

    return(
      <Fragment>
        {props.banner && React.cloneElement(props.banner,
          { offsetTop: (INSET_TOP + headerHeight) }
        )}
        <NavHeader 
          containerStyle={[styles.rootContainer, containerStyle]}
          {...props}
        >
          {this.props.children}
        </NavHeader>
      </Fragment>
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