import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import LinearGradient from 'react-native-linear-gradient';
import Feather        from 'react-native-vector-icons/Feather';

import { iOSUIKit } from 'react-native-typography';

import { GREY, PURPLE, BLUE, INDIGO } from 'app/src/constants/Colors';


export const ALIGNMENT = {
  'CENTER' : 'CENTER' ,
  'LEFT'   : 'LEFT'   ,
  'RIGHT'  : 'RIGHT'  ,
  'STRETCH': 'STRETCH',
};

export class ButtonGradient extends React.PureComponent {
  static propTypes = {
    //content
    title   : PropTypes.string,
    subtitle: PropTypes.string,
    //options - config/customize
    customContent: PropTypes.bool  ,
    showChevron  : PropTypes.bool  ,
    showIcon     : PropTypes.bool  ,
    alignment    : PropTypes.string,
    //options - colors related
    fgColor      : PropTypes.string,
    bgColor      : PropTypes.string,
    reverseColors: PropTypes.bool  ,
    //options - gradient related
    gradientColors: PropTypes.array,
    isBgGradient  : PropTypes.bool,
    gradientProps : PropTypes.object,
    //options - style adj/shortcuts
    iconDistance: PropTypes.number,
    borderRadius: PropTypes.number,
    addShadow   : PropTypes.bool  ,
    //style props
    containerStyle: PropTypes.object,
    textStyle: PropTypes.object,
    subtitleStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    subtitleStyle: PropTypes.object,
    middleContainerStyle: PropTypes.object,
  };

  static defaultProps = {
    //options
    customContent: false,
    showChevron  : false,
    showIcon     : true ,
    //options - colors related
    fgColor      : 'white'    ,
    bgColor      : PURPLE.A700,
    reverseColors: false      ,
    //options - gradient related
    isBgGradient  : false,
    gradientColors: [INDIGO.A700, BLUE.A400],
    //options - style adj/shortcuts
    iconDistance: 7,
    borderRadius: 13,
    addShadow: true,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      margin: 10,
    },
    shadow: {
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 3.5,
      shadowOffset: {
        width: 1,
        height: 3,
      },
    },
    iconContainer: {
      shadowColor: "white",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    gradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 7,
      paddingLeft: 15,
      paddingRight: 10,
    },
    title: {
      ...iOSUIKit.bodyEmphasizedObject,
      fontWeight: '800'
    },
    subtitle: {
      ...iOSUIKit.calloutObject,
      opacity: 0.8,
    },
  });

  getAlignment(){
    const { showChevron, showIcon, subtitle, alignment } = this.props;

    return(
      showChevron? ALIGNMENT.STRETCH :
      subtitle   ? ALIGNMENT.LEFT    :
      alignment  ? alignment         :
      showIcon   ? ALIGNMENT.CENTER  : ALIGNMENT.LEFT
    );
  };

  _renderMiddle(){
    const { styles } = ButtonGradient;
    const { title, subtitle, ...props } = this.props;

    const alignment = this.getAlignment();
    const middleContainerStyle = {
      ...((props.showChevron || alignment == ALIGNMENT.LEFT) && {
        flex: 1,
      }),
      ...((alignment == ALIGNMENT.CENTER) &&
        { marginVertical: 7 }
      ),
    };

    const textStyle = {
      color: props.fgColor,
    };
    
    return props.customContent? (
      props.children
    ): subtitle? (
      <View style={[styles.middleContainer, middleContainerStyle, props.middleContainerStyle]}>
        <Text style={[styles.title, textStyle, props.titleStyle]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, textStyle, props.subtitleStyle]}>
          {subtitle}
        </Text>
      </View>
    ):(
      <Text style={[styles.title, textStyle, middleContainerStyle, props.titleStyle]}>
        {title}
      </Text>
    );
  };

  _renderContent(){
    const { styles } = ButtonGradient;
    const props = this.props;

    const alignment = this.getAlignment();
    const iconContainerStyle = {
      marginRight: props.iconDistance,
      ...(alignment == ALIGNMENT.RIGHT && {
        flex: 1,
      }),
    };

    return(
      <Fragment>
        {props.showIcon && (
          <View style={[styles.iconContainer, props.iconContainerStyle, iconContainerStyle]}>
            {props.leftIcon}
          </View>
        )}
        <View/>
        {this._renderMiddle()}
        {props.showChevron && <Feather
          //pass down icon props
          name ={'chevron-right'}
          color={props.fgColor}
          size={24}
        />}
      </Fragment>
    );
  };

  render(){
    const { styles } = ButtonGradient;
    const props = this.props;
    
    const alignment = this.getAlignment();
    const containerStyle = {
      backgroundColor: props.bgColor,
      borderRadius   : props.borderRadius,
      ...( props.addShadow     && styles.shadow   ),
      ...(!props.isBgGradient  && styles.container),
      ...(!props.customContent && {
        justifyContent: (
          (alignment == ALIGNMENT.CENTER)? 'center'     :
          (alignment == ALIGNMENT.LEFT  )? 'flex-start' :
          (alignment == ALIGNMENT.RIGHT )? 'flex-end'   : null
        ),
      }),
    };
    
    return (
      <TouchableOpacity 
        style={[styles.rootContainer, containerStyle, props.containerStyle]}
        activeOpacity={0.8}
        {...props}
      >
        {props.isBgGradient? (
          <LinearGradient
            style={[styles.gradient, containerStyle]}
            colors={props.gradientColors}
            //horizontal gradient
            start={{ x: 0, y: 1 }}
            end  ={{ x: 1, y: 1 }}
            //pass down props
            {...props.gradientProps}
          >
            {this._renderContent()}
          </LinearGradient>
        ):(
          <View style={[styles.gradient, containerStyle]}>
            {this._renderContent()}
          </View>
        )}
      </TouchableOpacity>
    );
  };
};




