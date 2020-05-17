import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';


export class ModalBannerPill extends React.Component {
  static propTypes = {
    iconMap: PropTypes.object,
    offsetTop: PropTypes.number,
    bgColor: PropTypes.string,
  };

  static defaultProps = {
    offsetTop: 0,
    bgColor: Colors.BLUE.A400,
  };

  constructor(props){
    super(props);

    this.state = {
      mount: false,
      iconKey: null,
      messageTitle: null,
      messageBody : null,
    };
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    return(
      (prevProps.offsetTop    != nextProps.offsetTop   ) ||
      (prevProps.bgColor      != nextProps.bgColor     ) ||
      (prevState.mount        != nextState.mount       ) ||
      (prevState.iconKey      != nextState.iconKey     ) ||
      (prevState.messageTitle != nextState.messageTitle) ||
      (prevState.messageBody  != nextState.messageBody )
    );
  };

  clear = async () => {
    await Helpers.setStateAsync(this, {
      mount: false,
      iconKey: null,
      messageTitle: null,
      messageBody : null,
    });
  };

  show = async ({iconKey, message}) => {
    const state = this.state;

    if(!state.mount){
      await Helpers.setStateAsync(this, {
        iconKey,
        mount: true,
        messageTitle: message,
      });

      await this.rootContainerRef.fadeInDown(300);
      await this.rootContainerRef.pulse(750);
      await this.rootContainerRef.slideOutUp(500);
      await this.clear();
    };
  };

  render(){
    const props = this.props;
    const state = this.state;
    const { iconKey } = this.state;

    if(!state.mount) return null;

    const hasIcon = (
      (iconKey != null      ) &&
      (iconKey != undefined ) &&
      (iconKey != ''        )
    );

    const rootContainerStyle = {
      top: props.offsetTop,
      backgroundColor: props.bgColor,
    };

    const textContainerStyle = {
      marginLeft: (hasIcon? 10 : 0)
    };

    return (
      <Animatable.View
        ref={r => this.rootContainerRef = r}
        style={[styles.rootContainer, rootContainerStyle]}
        useNativeDriver={true}
      >
        {hasIcon && (props.iconMap?.[iconKey])}
        <View style={[styles.textContainer, textContainerStyle]}>
          <Text style={styles.texTitle}>
            {state.messageTitle}
          </Text>
        </View>
      </Animatable.View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
  },
  textContainer: {
  },
  texTitle: {
    ...iOSUIKit.subheadEmphasizedObject,
    color: 'white',
  },
});