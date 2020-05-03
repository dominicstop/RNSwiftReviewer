import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from 'react-native-reanimated';

import { Easing   } from 'react-native-reanimated';
import { BlurView } from "@react-native-community/blur";

import * as Helpers from 'app/src/functions/helpers';
import { MODAL_FOOTER_HEIGHT, MODAL_BOTTOM_PADDING, BORDER_WIDTH } from 'app/src/constants/UIValues';

const { Value, Extrapolate, interpolate, timing } = Reanimated;


const styles = StyleSheet.create({
  rootContainer: {
    height: (MODAL_FOOTER_HEIGHT + MODAL_BOTTOM_PADDING),
    //float top
    position: 'absolute',
    bottom: -MODAL_BOTTOM_PADDING,
    left: 0,
    right: 0,
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.075,
    shadowRadius: 3.84,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderTopWidth: BORDER_WIDTH,
    borderColor: 'rgba(0,0,0,0.3)',
    //fill space
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: MODAL_BOTTOM_PADDING,
  },
});

// Used in ModalBackground props: modalFooter
// accepts ModalFooterButton as children
export class ModalFooter extends React.Component {

  constructor(props){
    super(props);
    
    this.state = {
      visible: false,
    };

    this.progress = new Value(0);
    
    this.translateY = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [MODAL_BOTTOM_PADDING, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.scaleY = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [0.25, 1],
      extrapolate: Extrapolate.CLAMP,
    });

    this.opacity = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    return (
      // check if state changed
      (prevState.visible != nextState.visible)
    );
  };

  async componentDidMount(){
    await Helpers.timeout(500);
    this.setVisibility(true);
  };

  setVisibility = async (visibility) => {
    const { onFooterDidShow, onFooterDidHide } = this.props;
    const { visible } = this.state;

    if(visible != visibility){
      const animation = timing(this.progress, {
        duration: 300,
        ...(visibility? {
          easing : Easing.out(Easing.ease),
          toValue: 100,
        }:{
          easing : Easing.in(Easing.ease),
          toValue: 0,
        })
      });
      
      visibility && await Helpers.setStateAsync(this, {
        visible: visibility
      });

      await new Promise((resolve) => {
        animation.start(() => {
          resolve();
        });
      });

      !visibility && await Helpers.setStateAsync(this, {
        visible: visibility
      });

      (visibility
        ? onFooterDidShow && onFooterDidShow()
        : onFooterDidHide && onFooterDidHide()
      );
    };
  };

  render(){
    const { visible } = this.state;

    return(
      <Reanimated.View style={[styles.rootContainer, {
        opacity: this.opacity,
        transform: [
          { scaleY    : this.scaleY     },
          { translateY: this.translateY },
        ],
      }]}>
        <BlurView
          style={styles.blurBackground}
          blurType={'thinMaterialLight'}
          blurAmount={100}
        />
        <View style={styles.background}/>
        {visible && this.props.children}
      </Reanimated.View>
    );
  };
};