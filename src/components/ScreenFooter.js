import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import * as Animatable from 'react-native-animatable';

import { BlurView } from "@react-native-community/blur";

import { INSET_BOTTOM } from 'app/src/constants/UIValues';


const styles = StyleSheet.create({
  rootContainer: {
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    // float bottom
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // layout
    paddingBottom: INSET_BOTTOM,
    //shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: -5,
    },
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.5,
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
        animation={'bounceInUp'}
        duration={1250}
        useNativeDriver={true}
      >
        <BlurView
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