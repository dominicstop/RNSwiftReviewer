import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated, { Easing } from 'react-native-reanimated';
import { timeout, setStateAsync } from 'app/src/functions/helpers';

const { set, cond, block, add, Value, timing, interpolate, and, or, onChange, eq, call, Clock, clockRunning, startClock, stopClock, concat, color, divide, multiply, sub, lessThan, abs, modulo, round, debug, clock } = Reanimated;

// Fades in/out A/B children with changing height
export class TransitionWithHeight extends React.PureComponent {
  static propTypes = {
    unmountWhenHidden  : PropTypes.bool, // unmount hidden component
    showLastFirst      : PropTypes.bool, // initially shows B comp first
    handlePointerEvents: PropTypes.bool, // disables touchevents when hidden o you can press them
    //styles
    containerStyle: PropTypes.object,
  };

  static defaultProps = {
    showLastFirst: false,
  };

  static styles = StyleSheet.create({
    container: {
      flex: 1,
      overflow: 'hidden',
    },
    transAContainer: {
      position: 'absolute',
      width: '100%',
    },
    transBContainer: {
      position: 'absolute',
      width: '100%',
    },
  });

  constructor(props){
    super(props);
    
    //show A comp first
    this.showCompA = props.showLastFirst;

    // store recorded height
    this.layoutHeightA = props.heightA ?? -1;
    this.layoutHeightB = props.heightB ?? -1;

    this.progress = new Value(
      props.showLastFirst? 100 : 0
    );

    // final expanded height for each trans item
    this.heightA = new Value(props.heightA ?? -1);
    this.heightB = new Value(props.heightB ?? -1);

    this.opacityA = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [1, 0 ],
      extrapolate: 'clamp',
    });

    this.opacityB = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [0 , 1 ],
      extrapolate: 'clamp',
    });

    this.height = interpolate(this.progress, {
      inputRange : [0, 100],
      outputRange: [this.heightA, this.heightB],
      extrapolate: 'clamp',
    });

    this.state = {
      ...(props.showLastFirst
        ? { mountA: false, mountB: true  } // show B first
        : { mountA: true , mountB: false } // show A first
      ),
      // when true, A receives touch events
      touchEventsA: true, 
    };
  };

  async transition(showCompA = true){
    const { handlePointerEvents, unmountWhenHidden, onTransition } = this.props;
    const shouldSetState = (handlePointerEvents || unmountWhenHidden);

    // if showCompA is different
    if(this.showCompA != showCompA){
      const animation = timing(this.progress, {
        duration: 300,
        toValue : showCompA? 100 : 0,
        easing  : Easing.inOut(Easing.ease),
      });

      // show other comp before transitioning
      unmountWhenHidden && await setStateAsync(this, (showCompA
        ? { mountB: true }
        : { mountA: true }
      ));

      const isHeightDefined = (
        this.layoutHeightA != -1 &&
        this.layoutHeightB != -1
      );

      //delay animation if there's no height 
      isHeightDefined && await timeout(100);

      //start and wait for animation to fin
      await new Promise((resolve) => {
        animation.start(({finished}) => {
          resolve();
        });
      });

      shouldSetState && await setStateAsync(this, {
        ...(handlePointerEvents && {
          touchEventsA: !showCompA,
        }),
        ...(unmountWhenHidden && {
          mountA: !showCompA,
          mountB:  showCompA,
        }),
      });

      //update
      this.showCompA = showCompA;

      //call callback
      onTransition && onTransition(this.showCompA);
    };
  };

  toggle(){
    this.transition(!this.showCompA);
  };  

  _handleOnLayoutA = ({nativeEvent}) => {
    const { height } = nativeEvent.layout;
    if(this.layoutHeightA == -1){
      this.heightA.setValue(height);
      this.layoutHeightA = height;
    };
  };

  _handleOnLayoutB = ({nativeEvent}) => {
    const { height } = nativeEvent.layout;
    if(this.layoutHeightB == -1){
      this.heightB.setValue(height);
      this.layoutHeightB = height;
    };
  };

  render(){
    const { styles } = TransitionWithHeight;
    const { mountA, mountB,  touchEventsA } = this.state;
    const { renderHeader, ...props } = this.props

    const containerStyle = {
      height: this.height,
    };
    
    const transAStyle = {
      opacity: this.opacityA,
    };

    const transBStyle = {
      opacity: this.opacityB,
    };

    const disabledPointerEvent = (
      props.handlePointerEvents? 'none' : 'auto'
    );

    const ComponentA = (
      <View 
        onLayout={this._handleOnLayoutA}
        pointerEvents={'box-none'}
      >
        {props.children[0]}
      </View>
    );

    const ComponentB = (
      <View 
        onLayout={this._handleOnLayoutB}
        pointerEvents={'box-none'}
      >
        {props.children[1]}
      </View>
    );

    return(
      <Fragment>
        {renderHeader && renderHeader(this.progress)}
        <Reanimated.View style={[styles.container, containerStyle, props.containerStyle]}>
          <Reanimated.View 
            style={[styles.transAContainer, transAStyle]}
            pointerEvents={touchEventsA? 'auto' : disabledPointerEvent}
          >
            {(props.unmountWhenHidden
              ? (mountA && ComponentA)
              : (ComponentA)
            )}
          </Reanimated.View>
          <Reanimated.View 
            style={[styles.transBContainer, transBStyle]}
            pointerEvents={touchEventsA? disabledPointerEvent : 'auto'}
          >
            {(props.unmountWhenHidden
              ? (mountB && ComponentB)
              : (ComponentB)
            )}
          </Reanimated.View>
        </Reanimated.View>
      </Fragment>
    );
  };
};