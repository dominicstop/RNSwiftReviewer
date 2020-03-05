import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit } from 'react-native-typography';
import * as Animatable from 'react-native-animatable';

import { ListCard } from 'app/src/components/ListCard';


export class ListCardEmpty extends React.Component {
  static propTypes = {
    imageSource: PropTypes.object,
    title      : PropTypes.string,
    subtitle   : PropTypes.string,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 85,
      height: 85,
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
      paddingVertical: 5,
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      fontSize: iOSUIKit.bodyEmphasizedObject.fontSize + 1,
      fontWeight: '700',
      marginBottom: 1,
    },
    textSubtitle: {
      ...iOSUIKit.bodyObject,
      maxWidth: 275,
    },
  });

  render(){
    const { styles } = ListCardEmpty;
    const props = this.props;

    return(
      <ListCard style={styles.rootContainer}>
        <Animatable.Image
          style={styles.image}
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
      </ListCard>
    );
  };
};