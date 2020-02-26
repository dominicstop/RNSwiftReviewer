import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated, { Extrapolate } from "react-native-reanimated";
import { iOSUIKit } from 'react-native-typography';


export class LargeTitleHeaderCard  extends React.Component {
  static propTypes = {
    imageSource: PropTypes.number,
    textBody   : PropTypes.string,
    textTitle  : PropTypes.string,
    //receive from LargeTitleFlatList
    scrollY   : PropTypes.object,
    inputRange: PropTypes.object,
  };

  static defaultProps = {
    imageSource: require('app/assets/icons/circle_paper_pencil.png'),
    textBody   : 'Nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: 'white',
    },
    topContentContainer: {
      paddingHorizontal: 10,
      paddingTop: 15,
    },
    imageTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleBodyContainer: {
      flex: 1,
      marginLeft: 15,
      justifyContent: 'center',
    },
    iconImage: {
      width: 75,
      height: 75,
    },
    textBody: {
      ...iOSUIKit.subheadObject,
      textAlignVertical: 'center',
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      fontWeight: '700',
    },
  });

  constructor(props){
    super(props);

    this._titleHeight = Reanimated.interpolate(props.scrollY, {
      inputRange : props.inputRange,
      outputRange: [0, 23],
      extrapolate: Extrapolate.CLAMP,
    });

    const inputEnd = props.inputRange[1];
    this._titleOpacity = Reanimated.interpolate(props.scrollY, {
      inputRange : [(inputEnd / 1.5), inputEnd],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    
    this._titleScale = Reanimated.interpolate(props.scrollY, {
      inputRange : props.inputRange,
      outputRange: [0.75, 1],
      extrapolate: Extrapolate.CLAMP,
    });

    this._titleTransX = Reanimated.interpolate(props.scrollY, {
      inputRange : props.inputRange,
      outputRange: [-50, 0],
      extrapolate: Extrapolate.CLAMP,
    });
  };

  _renderAnimatedTitle(){
    const { styles } = LargeTitleHeaderCard;

    const style = {
      height: this._titleHeight,
      opacity: this._titleOpacity,
      transform: [
        { scale: this._titleScale },
        { translateX: this._titleTransX },
      ],
    };

    return(
      <Reanimated.View style={style}>
        <Text style={styles.textTitle}>
          {this.props.textTitle}
        </Text>
      </Reanimated.View>
    );
  };

  render(){
    const { styles } = LargeTitleHeaderCard;
    const props = this.props;

    const hasAnimatedValues = (
      props.scrollY && props.inputRange
    );

    return(
      <View style={styles.rootContainer}>
        <View style={styles.topContentContainer}>
          <View style={styles.imageTextContainer}>
            <Image
              style={styles.iconImage}
              source={props.imageSource}
            />
            <View style={styles.titleBodyContainer}>
              {hasAnimatedValues && this._renderAnimatedTitle()}
              <Text style={styles.textBody}>
                {props.textBody}
              </Text>
            </View>
          </View>
        </View>
        {props.children}
      </View>
    );
  };
};