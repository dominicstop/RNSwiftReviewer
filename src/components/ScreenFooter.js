import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import { VibrancyView } from "@react-native-community/blur";

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { TB_HEIGHT_ADJ, INSET_BOTTOM } from 'app/src/constants/UIValues';


const styles = StyleSheet.create({
  rootContainer: {
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    // float bottom
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    //layout
    paddingBottom: INSET_BOTTOM,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.75,
  },
});

export class ScreenFooter extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      mount: false
    };
  };

  setVisibilty = async (isVisible) => {
    const { mount } = this.state;
    const didChange = (mount != isVisible);

    if(didChange && isVisible){
      this.setState({  mount: true });
      await Helpers.timeout(300);
      await this.rootContainerRef.pulse(500);
      
    } else if(didChange && !isVisible){
      await this.rootContainerRef.slideInDown(300);
    };
  };

  render(){
    const { mount } = this.state;
    if(!mount) return null;

    return(
      <Animatable.View
        style={styles.rootContainer}
        ref={r => this.rootContainerRef = r}
        animation={'slideInUp'}
        duration={300}
        easing={'ease-in-out'}
        useNativeDriver={true}
      >
        <VibrancyView
          style={styles.blurBackground}
          blurType={"light"}
          intensity={100}
        />
        <View style={styles.background}/>
        {this.props.children}
      </Animatable.View>
    );
  };
};