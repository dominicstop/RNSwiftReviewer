import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit } from 'react-native-typography';

import { ListCard           } from 'app/src/components/ListCard';
import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';


export class ImageTitleSubtitleCard extends React.Component {
  static propTypes = {
    title      : PropTypes.string,
    subtitle   : PropTypes.string,
    imageSource: PropTypes.number,
    imageSize  : PropTypes.number,
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
    const { styles } = ImageTitleSubtitleCard;
    const props = this.props;

    return (
      <ListCard style={[styles.rootContainer, props.containerStyle]}>
        <ImageTitleSubtitle  {...props}/>
        {this.props.children}
      </ListCard>
    );
  };
};