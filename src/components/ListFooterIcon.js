import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import { BLUE } from 'app/src/constants/Colors';

import * as Animatable from 'react-native-animatable';
import Ionicon         from '@expo/vector-icons/Ionicons';


export class ListFooterIcon extends React.Component {
  static propTypes = {
    show     : PropTypes.bool,
    marginTop: PropTypes.number
  };

  static defaultProps = {
    show     : false,
    marginTop: 13   ,
    hasEntranceAnimation: true,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1, 
      alignItems: 'center',
    },
  });

  constructor(props){
    super(props);

    this.state = {
      show: props.show,
    };
  };

  show = (show) => {
    const { show: prevShow } = this.state;
    if(show != prevShow){
      this.setState({ show });
    };
  };

  render(){
    const { styles } = ListFooterIcon;
    const { marginTop, ...props } = this.props;

    const footerIcon = (
      <Animatable.View
        duration={1000}
        delay={1500}
        animation={'pulse'}
        iterationCount={'infinite'}
        iterationDelay={1000}
        useNativeDriver={true}
      >
        <Ionicon
          style={{opacity: 0.3}}
          name={'ios-heart'}
          size={23}
          color={BLUE.A700}
        />
      </Animatable.View>
    );

    return props.hasEntranceAnimation? (
      <Animatable.View
        style={[styles.rootContainer, {marginTop}]}
        duration={500}
        delay={1000}
        animation={'fadeInUp'}
        useNativeDriver={true}
      >
        {footerIcon}
      </Animatable.View>
    ):(
      <View style={[styles.rootContainer, {marginTop}]}>
        {footerIcon}
      </View>
    );
  };
};