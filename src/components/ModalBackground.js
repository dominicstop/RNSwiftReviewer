import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { VibrancyView, BlurView } from "@react-native-community/blur";

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
  },
  scrollviewContent: {
    paddingBottom: MODAL_FOOTER_HEIGHT,
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
    const { modalHeader, modalFooter, overlay } = this.props;
    const { mount } = this.state;

    return(
      <View style={styles.rootContainer}>
        <BlurView 
          style={styles.blurBackground}
          blurType={'light'}
          blurAmount={100}
        />
        <View style={styles.background}/>
        <View style={styles.scrollViewContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollviewContent}
            contentInset={{
              top   : MODAL_HEADER_HEIGHT,
              bottom: MODAL_FOOTER_HEIGHT,
            }}
          >
            {mount && (
              <Animatable.View
                animation={'fadeInUp'}
                duration={250}
                useNativeDriver={true}
              >
                {this.props.children}  
              </Animatable.View>
            )}
          </ScrollView>
        </View>
        {modalHeader}
        {modalFooter}
        {overlay}
      </View>
    );
  };
};