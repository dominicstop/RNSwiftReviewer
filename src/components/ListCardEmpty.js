import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit } from 'react-native-typography';
import * as Animatable from 'react-native-animatable';

import { ListCard } from 'app/src/components/ListCard';


export class ListCardEmpty extends React.Component {
  static propTypes = {
    title      : PropTypes.string,
    subtitle   : PropTypes.string,
    imageSource: PropTypes.number,
    imageSize  : PropTypes.number,
  };

  static defaultProps = {
    imageSize: 77,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      paddingHorizontal: 0,
    },
    imageTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 13,
    },
    image: {
      width: 85,
      aspectRatio: 1,
    },
    textContainer: {
      flex: 1,
      marginLeft: 15,
      paddingVertical: 5,
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      fontWeight: '700',
      marginBottom: 1,
    },
    textSubtitle: {
      ...iOSUIKit.subheadObject,
      maxWidth: 275,
    },
  });

  render(){
    const { styles } = ListCardEmpty;
    const props = this.props;

    const imageStyle = {
      width: props.imageSize,
    };

    return(
      <Animatable.View
        animation={'fadeInUp'}
        duration={300}
        delay={750}
        useNativeDriver={true}
      >
        <ListCard style={[styles.rootContainer, props.containerStyle]}>
          <View style={styles.imageTextContainer}>
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
              <Text style={styles.textTitle}>
                {props.title}
              </Text>
              <Text style={styles.textSubtitle}>
                {props.subtitle}
              </Text>
            </View>
          </View>
          {this.props.children}
        </ListCard>
      </Animatable.View>
    );
  };
};