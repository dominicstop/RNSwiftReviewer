import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from "react-native-reanimated";
import { iOSUIKit } from 'react-native-typography';


export class LargeTitleHeaderCard  extends React.Component {
  static propTypes = {
    imageSource: PropTypes.number,
    textBody   : PropTypes.string,
  };

  static defaultProps = {
    imageSource: require('app/assets/icons/circle_paper_pencil.png'),
    textBody   : 'Nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
    imageTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconImage: {
      width: 80,
      height: 80,
    },
    textBody: {
      ...iOSUIKit.subheadObject,
      flex: 1,
      marginLeft: 15,
    },
  });

  render(){
    const { styles } = LargeTitleHeaderCard ;
    const props = this.props;

    return(
      <View style={styles.rootContainer}>
        <View style={styles.imageTextContainer}>
          <Image
            style={styles.iconImage}
            source={props.imageSource}
          />
          <Text style={styles.textBody}>
            {props.textBody}
          </Text>
        </View>
      </View>
    );
  };
};