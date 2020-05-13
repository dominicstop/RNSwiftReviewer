import React from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

import { Easing   } from 'react-native-reanimated';
import { BlurView } from "@react-native-community/blur";

import { AnimatedListItem } from 'app/src/components/AnimatedListItem';

import * as Helpers from 'app/src/functions/helpers';
import { MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT, MODAL_HEADER_HEIGHT_COMPACT } from 'app/src/constants/UIValues';
import { ModalHeaderCompact } from './ModalHeaderCompact';

const { Value, Extrapolate, interpolate, timing } = Reanimated;

const HEADER_MODES = {
  NONE   : 'NONE'   ,
  DEFAULT: 'DEFAULT',
  COMPACT: 'COMPACT',
};

function getHeaderValues(mode){
  switch (mode) {
    case HEADER_MODES.NONE: return {
      insetTop: 0,
      backgroundStyle: { top: 0 },
      scrollviewStyle: { top: 0 },
    };
    case HEADER_MODES.DEFAULT: return {
      insetTop: MODAL_HEADER_HEIGHT,
      backgroundStyle: { top       : MODAL_HEADER_HEIGHT },
      scrollviewStyle: { paddingTop: MODAL_HEADER_HEIGHT },
    };
    case HEADER_MODES.COMPACT: return {
      insetTop: MODAL_HEADER_HEIGHT_COMPACT,
      backgroundStyle: { top: 0 },
      scrollviewStyle: { paddingTop: MODAL_HEADER_HEIGHT_COMPACT },
    };
  };
};

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
  },
  scrollviewContent: {
    paddingBottom: MODAL_FOOTER_HEIGHT + 100,
  },
});

// Used for creating modals
// Used as a root comp. as a wrapper
// blurred background + header/footer support
export class ModalBody extends React.Component {
  static propTypes = {
    headerMode         : PropTypes.string ,
    overlay            : PropTypes.element,
    modalHeader        : PropTypes.element,
    modalFooter        : PropTypes.element,
    animateAsGroup     : PropTypes.bool   ,
    wrapInScrollView   : PropTypes.bool   ,
    passScrollviewProps: PropTypes.bool   ,
  };

  static defaultProps = {
    headerMode         : HEADER_MODES.DEFAULT,
    animateAsGroup     : false,
    footerBGVisible    : true ,
    wrapInScrollView   : true ,
    passScrollviewProps: true ,
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
      footerBGVisible: props.footerBGVisible,
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

    const insetBottom  = (keyboardVisible? 0 : MODAL_FOOTER_HEIGHT);
    const headerValues = getHeaderValues(props.headerMode);

    const scrollViewProps = {
      ...props,
      style: [styles.scrollView, headerValues.scrollviewStyle],
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
    const { headerMode, modalHeader, modalFooter, overlay, ...props } = this.props;
    const { mount, keyboardVisible, footerBGVisible } = this.state;

    const headerValues = getHeaderValues(headerMode);
    const insetBottom  = (keyboardVisible ? 0 : MODAL_FOOTER_HEIGHT);

    const backgroundStyle = {
      ...headerValues.backgroundStyle,
      bottom: (footerBGVisible ? 0 : MODAL_FOOTER_HEIGHT),
    };

    return(
      <View style={styles.rootContainer}>
        <BlurView 
          style={[styles.blurBackground, backgroundStyle]}
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
            {React.cloneElement(props.children, props.passScrollviewProps? {
              // pass down scrollview props to child
              style: [styles.scrollView, headerValues.scrollviewStyle],
              contentContainerStyle: styles.scrollviewContent,
              scrollIndicatorInsets: { 
                top   : headerValues.insetTop,
                bottom: insetBottom,
              },
            }:{
              // pass down props to child
              topSpace   : headerValues.insetTop,
              bottomSpace: insetBottom,
            })}
          </Animatable.View>
        ))}
        <Reanimated.View
          style={{ height: this._height }}
        />
        {(headerMode == HEADER_MODES.NONE   )? null :
         (headerMode == HEADER_MODES.DEFAULT)? modalHeader :
         (headerMode == HEADER_MODES.COMPACT)? <ModalHeaderCompact/> : null
        }
        {modalFooter}
        {overlay}
      </View>
    );
  };
};