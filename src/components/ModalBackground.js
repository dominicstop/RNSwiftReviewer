import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import {  BlurView } from "@react-native-community/blur";

import { AnimatedListItem } from 'app/src/components/AnimatedListItem';

import * as Helpers from 'app/src/functions/helpers';
import { MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT } from 'app/src/constants/UIValues';


const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  blurBackground: {
    //fill space
    position: 'absolute',
    top: MODAL_HEADER_HEIGHT,
    left: 0,
    right: 0,
    bottom: MODAL_FOOTER_HEIGHT,
  },
  background: {
    backgroundColor: 'rgba(250,250,250,0.4)',
    //fill space
    position: 'absolute',
    top: MODAL_HEADER_HEIGHT,
    left: 0,
    right: 0,
    bottom: MODAL_FOOTER_HEIGHT,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: MODAL_HEADER_HEIGHT,
  },
  scrollviewContent: {
    paddingBottom: MODAL_FOOTER_HEIGHT + 200,
  },
});

export class ModalBackground extends React.PureComponent {
  static propTypes = {
    modalHeader: PropTypes.element,
  };

  constructor(props){
    super(props);

    this.state = {
      mount: false,
    };
  };

  async componentDidMount(){
    await Helpers.timeout(250);
    this.setState({ mount: true });
  };

  render(){
    const { modalHeader, modalFooter, overlay, ...props } = this.props;
    const { mount } = this.state;

    const children = React.Children.map(props.children,
      (child, index) => (
        <AnimatedListItem
          animation={'fadeInUp'}
          duration={300}
          last={4}
          {...{index}}
        >
          {child}
        </AnimatedListItem>
      )
    );
    
    return(
      <View style={styles.rootContainer}>
        <BlurView 
          style={styles.blurBackground}
          blurType={'light'}
          blurAmount={75}
        />
        <View style={styles.background}/>
        <View style={styles.scrollViewContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollviewContent}
            scrollIndicatorInsets={{ 
              top   : MODAL_HEADER_HEIGHT,
              bottom: MODAL_FOOTER_HEIGHT
            }}
            {...this.props}
          >
            {mount && children}
          </ScrollView>
        </View>
        {modalHeader}
        {modalFooter}
        {overlay}
      </View>
    );
  };
};