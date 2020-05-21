import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import * as Colors from 'app/src/constants/Colors';



export class ModalDragIndicator extends React.PureComponent {
  render(){
    return(
      <Animatable.View 
        style={styles.dragIndicator}
        animation={'pulse'}
        duration={2000}
        iterationCount={'infinite'}
        iterationDelay={2000}
        useNativeDriver={true}
      />
    );
  };
};

const styles = StyleSheet.create({
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    marginTop: 7,
    alignSelf: 'center',
  },
});