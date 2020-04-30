import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit, sanFranciscoWeights } from 'react-native-typography';

import * as Colors  from 'app/src/constants/Colors';


export class DetailPill extends React.Component {
  static propTypes = {
    title   : PropTypes.string,
    subtitle: PropTypes.string,
    //options
    help        : PropTypes.bool  ,
    helpTitle   : PropTypes.string,
    helpSubtitle: PropTypes.string,
    addGlow     : PropTypes.bool  ,
    //styles
    titleStyle   : PropTypes.object,
    subtitleStyle: PropTypes.object,
  };

  static defaultProps = {
    addGlow: true,
  };

  shouldComponentUpdate(nextProps){
    const prevProps = this.props;

    return(
      (prevProps.title    != nextProps.title   ) ||
      (prevProps.subtitle != nextProps.subtitle) 
    );
  };

  _handleOnPress = () => {
    const props = this.props;
    Alert.alert(
      props.helpTitle    || 'Help Info',
      props.helpSubtitle || 'Info N/A' ,
    );
  };

  _renderSubtitle(){
    const { children, ...props } = this.props;
    const style = [styles.subtitle, props.subtitleStyle];

    const childrenCount = React.Children.count(children);
    
    return (childrenCount > 0)? (
      React.cloneElement(children, {style})
    ):(
      <Text numberOfLines={1} {...{style}}>
        {props.subtitle}
      </Text>
    );
  };

  render(){
    const { backgroundColor, ...props } = this.props;

    const subtitleContainerStyle = {
      ...(props.addGlow && styles.glow),
      ...(backgroundColor && {
        backgroundColor,
        shadowColor: backgroundColor,
      }),
    };

    const content = (
      <Fragment>
        <Text 
          style={[styles.title, props.titleStyle]}
          numberOfLines={1}
        >
          {props.title}
        </Text>
        <View style={[styles.subtitleContainer, subtitleContainerStyle]}>
          {this._renderSubtitle()}
        </View>
      </Fragment>
    );

    return ((props.help)? (
      <TouchableOpacity
        style={props.containerStyle}
        onPress={this._handleOnPress}
        activeOpacity={0.75}
      >
        {content}
      </TouchableOpacity>
    ):(
      <View style={props.containerStyle}>
        {content}
      </View>
    ));
  };
};

const styles = StyleSheet.create({
  title: {
    ...iOSUIKit.subheadObject,
    ...sanFranciscoWeights.medium,
    fontSize: 16,
    color: Colors.BLUE[1100],
  },
  subtitleContainer: {
    marginTop: 5,
    marginBottom: 3,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: Colors.BLUE.A400,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...iOSUIKit.subheadEmphasizedObject,
    ...sanFranciscoWeights.semibold,
    color: 'white',
    shadowColor: 'white', 
    shadowRadius: 7, 
    shadowOpacity: 0.5,
    shadowOffset:{  
      width: 1,  
      height: 4,  
    }, 
  },
  glow: {
    shadowColor: Colors.BLUE.A400, 
    shadowRadius: 5, 
    shadowOpacity: 0.2,
    shadowOffset:{  
      width: 1,  
      height: 4,  
    }, 
  },
});