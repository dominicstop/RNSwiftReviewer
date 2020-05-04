import React from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { Easing   } from 'react-native-reanimated';
import { BlurView } from "@react-native-community/blur";

import { AnimatedListItem } from 'app/src/components/AnimatedListItem';

import * as Helpers from 'app/src/functions/helpers';
import { MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT } from 'app/src/constants/UIValues';

const { Value, Extrapolate, interpolate, timing } = Reanimated;


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
    backgroundColor: 'rgba(252,252,252,0.7)',
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
    paddingBottom: MODAL_FOOTER_HEIGHT + 100,
  },
});

// Used for creating modals
// Used as a root comp. as a wrapper
// blurred background + header/footer support
export class ModalBackground extends React.Component {
  static propTypes = {
    overlay         : PropTypes.element,
    modalHeader     : PropTypes.element,
    modalFooter     : PropTypes.element,
    animateAsGroup  : PropTypes.bool   ,
    wrapInScrollView: PropTypes.bool   ,
  };

  static defaultProps = {
    animateAsGroup  : false,
    wrapInScrollView: true ,
  };

  constructor(props){
    super(props);

    this.keyboardHeight = 0;
    
    this.progress            = new Value(0);
    this.keyboardHeightValue = new Value(0);

    this._height = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [0, this.keyboardHeightValue],
      extrapolate: Extrapolate.CLAMP,
    });

    this.state = {
      mount: false,
      keyboardVisible: false,
      footerBGVisible: true,
    };
  };

  async componentDidMount(){
    // subscribe to event listeners
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow' , this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);

    await Helpers.timeout(50);
    this.setState({ mount: true });
  };

  componentWillUnmount() {
    // ubsubsrcibe to event listeners
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  _keyboardDidShow = (event) => {
    const keyboardHeight = event.endCoordinates.height;

    if(this.keyboardHeight == 0){
      this.keyboardHeight = keyboardHeight;
      this.keyboardHeightValue.setValue(keyboardHeight);
    };

    this.setState({
      keyboardVisible: true
    });

     const animation = timing(this.progress, {
      duration: 250,
      toValue: 100,
      easing: Easing.inOut(Easing.ease),
    });

    animation.start();
  };

  _keyboardWillHide = () => {
    const animation = timing(this.progress, {
      duration: 250,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    });

    this.setState({
      keyboardVisible: false
    });

    animation.start();
  };

  _renderScrollView(){
    const props = this.props;
    const { mount, keyboardVisible } = this.state;

    const insetBottom = (keyboardVisible? 0 : MODAL_FOOTER_HEIGHT);

    const scrollViewProps = {
      ...props,
      style: styles.scrollView,
      contentContainerStyle: styles.scrollviewContent,
      keyboardShouldPersistTaps: 'never',
      keyboardDismissMode: 'interactive',
      scrollIndicatorInsets: { 
        top   : MODAL_HEADER_HEIGHT,
        bottom: insetBottom,
      },
    };

    if(props.animateAsGroup && mount){
      return(
        <Animatable.View
          style={{flex: 1}}
          ref={r => this.animatedWrapperRef = r}
          animation={'fadeInUp'}
          duration={250}
          useNativeDriver={true}
        >
          <ScrollView {...scrollViewProps}>
            {props.children}
          </ScrollView>
        </Animatable.View>
      );

    } else {
      const children = React.Children.map(props.children, (child, index) => (
        <AnimatedListItem
          animation={'fadeInUp'}
          duration={250}
          last={4}
          {...{index}}
        >
          {child}
        </AnimatedListItem>
      ));

      return (
        <ScrollView {...scrollViewProps}>
          {mount && children}
        </ScrollView>
      );
    };
  };

  render(){
    const { modalHeader, modalFooter, overlay, ...props } = this.props;
    const { mount, keyboardVisible, footerBGVisible } = this.state;

    const insetBottom = (keyboardVisible? 0 : MODAL_FOOTER_HEIGHT);

    const blurBackgroundStyle = {
      bottom: (footerBGVisible? 0 : MODAL_FOOTER_HEIGHT),
    };

    const backgroundStyle = {
      bottom: (footerBGVisible? 0 : MODAL_FOOTER_HEIGHT),
    };

    return(
      <View style={styles.rootContainer}>
        <BlurView 
          style={[styles.blurBackground, blurBackgroundStyle]}
          blurType={'light'}
          blurAmount={75}
        />
        <View style={[styles.background, backgroundStyle]}/>
        {props.wrapInScrollView? (
          this._renderScrollView()
        ):(mount && (
          <Animatable.View
            ref={r => this.animatedWrapperRef = r}
            style={{flex: 1}}
            animation={'fadeInUp'}
            duration={300}
            useNativeDriver={true}
          >
            {React.cloneElement(props.children, {
              style: styles.scrollView,
              contentContainerStyle: styles.scrollviewContent,
              scrollIndicatorInsets: { 
                top   : MODAL_HEADER_HEIGHT,
                bottom: insetBottom,
              },
            })}
          </Animatable.View>
        ))}
        <Reanimated.View
          style={{ height: this._height }}
        />
        {modalHeader}
        {modalFooter}
        {overlay}
      </View>
    );
  };
};