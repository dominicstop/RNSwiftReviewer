import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';


export class BannerPill extends React.Component {
  static propTypes = {
    iconMap: PropTypes.object,
    offsetTop: PropTypes.number,
    useFirstIconAsDefault: PropTypes.bool,
  };

  static defaultProps = {
    offsetTop: 0,
    useFirstIconAsDefault: false
  };

  constructor(props){
    super(props);

    const iconMap   = props.iconMap;
    const iconKeys  = Object.keys(iconMap);
    const iconCount = iconKeys.length;

    this.iconCount = iconCount;
    
    this.state = {
      mount: false,
      messageTitle: null,
      messageBody : null,
      bgColor: Colors.BLUE.A400,
      iconKey: ((iconCount == 1 && props.useFirstIconAsDefault)
        ? iconKeys[0]
        : null
      ),

    };
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    return(
      (prevProps.bgColor      != nextProps.bgColor     ) ||
      (prevProps.offsetTop    != nextProps.offsetTop   ) ||
      (prevState.mount        != nextState.mount       ) ||
      (prevState.iconKey      != nextState.iconKey     ) ||
      (prevState.bgColor      != nextState.bgColor     ) || 
      (prevState.messageBody  != nextState.messageBody ) ||
      (prevState.messageTitle != nextState.messageTitle) 
    );
  };

  clear = async () => {
    const { useFirstIconAsDefault } = this.props;

    await Helpers.setStateAsync(this, {
      mount: false,
      messageTitle: null,
      messageBody : null,
      bgColor: Colors.BLUE.A400,
      ...((this.iconCount > 1 && !useFirstIconAsDefault)
        && { iconKey: null }
      ),
    });
  };

  show = async ({iconKey, message, bgColor, duration}) => {
    const { useFirstIconAsDefault } = this.props;
    const state = this.state;

    if(!state.mount){
      await Helpers.setStateAsync(this, {
        mount: true,
        messageTitle: message,
        bgColor: (bgColor ?? Colors.BLUE.A400),
        ...((this.iconCount > 1 && !useFirstIconAsDefault)
          && { iconKey }
        )
      });

      // animate in
      await this.rootContainerRef.fadeInDown(300);
      await this.rootContainerRef.pulse(750);

      duration && await Helpers.timeout(duration);

      // animate out
      await this.rootContainerRef.fadeOutUp(500);
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
      backgroundColor: state.bgColor,
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
    // shadow
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOpacity: 1,
    shadowRadius: 1.41,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  textContainer: {
  },
  texTitle: {
    ...iOSUIKit.subheadEmphasizedObject,
    color: 'white',
  },
});