import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import { iOSUIKit } from 'react-native-typography';

import * as Colors   from 'app/src/constants/Colors';


export class ImageTitleSubtitle extends React.Component {
  static propTypes = {
    title      : PropTypes.string,
    subtitle   : PropTypes.string,
    imageSource: PropTypes.number,
    imageSize  : PropTypes.number,
    hasPadding : PropTypes.bool  ,
    //style props
    containerStyle: PropTypes.object,
    titleStyle    : PropTypes.object,
    subtitleStyle : PropTypes.object,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 13,
      paddingVertical: 5,
    },
    rootContainerNoPadding: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 85,
      aspectRatio: 1,
    },
    textContainer: {
      flex: 1,
      marginLeft: 13,
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      fontWeight: '700',
      marginBottom: 1,
    },
    textSubtitle: {
      ...iOSUIKit.subheadObject,
      maxWidth: 275,
      color: Colors.GREY[800],
    },
  });

  static defaultProps = {
    imageSize: 77,
    title     : 'Cursus Commodo',
    subtitle  : 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.',
    hasPadding: true,
  };

  render(){
    const { styles } = ImageTitleSubtitle;
    const props = this.props;

    const imageStyle = {
      width: props.imageSize,
    };

    const rootContainerStyle = (props.hasPadding
      ? styles.rootContainer
      : styles.rootContainerNoPadding
    );

    return(
      <View style={[rootContainerStyle, props.containerStyle]}>
        <Animatable.Image
          style={[styles.image, imageStyle]}
          source={props.imageSource}
          animation={'pulse'}
          duration={7000}
          iterationCount={'infinite'}
          iterationDelay={1500}
          delay={1000}
          useNativeDriver={true}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.textTitle, props.titleStyle]}>
            {props.title}
          </Text>
          <Text style={[styles.textSubtitle, props.subtitleStyle]}>
            {props.subtitle}
          </Text>
        </View>
      </View>
    );
  };
};