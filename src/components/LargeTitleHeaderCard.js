import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated, { Extrapolate } from "react-native-reanimated";
import { iOSUIKit } from 'react-native-typography';

import * as Helpers from 'app/src/functions/helpers';


const iconSize = Helpers.sizeSelectVerbose({
  xsmall: 60, small : 65, normal: 70,
  large : 85, xlarge: 85,
});

const spacerSize = Helpers.sizeSelectVerbose({
  xsmall: 12, small : 12, normal: 15,
  large : 17, xlarge: 17,
});


export class LargeTitleHeaderCard  extends React.Component {
  static propTypes = {
    textBody       : PropTypes.string,
    textTitle      : PropTypes.string,
    imageSource    : PropTypes.number,
    isTitleAnimated: PropTypes.bool  ,
    //receive from LargeTitleFlatList
    scrollY   : PropTypes.object,
    inputRange: PropTypes.array,
  };

  static defaultProps = {
    imageSource: require('app/assets/icons/circle_paper_pencil.png'),
    textBody   : 'Nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: 'white',
    },
    shadow: {
      //shadows
      paddingBottom: 5,
      shadowColor: "#000",
      shadowOpacity: 0.10,
      shadowRadius: 7,
      shadowOffset: {
        width: 0,
        height: 7,
      },
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
      marginLeft: spacerSize,
      justifyContent: 'center',
    },
    iconImage: {
      width: iconSize,
      aspectRatio: 1,
    },
    textBody: {
      ...iOSUIKit.subheadObject,
      textAlignVertical: 'center',
      maxWidth: 290,
    },
    textTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
      fontWeight: '700',
    },
  });

  constructor(props){
    super(props);

    this.isTitleAnimated = (
      props.isTitleAnimated &&
      props.inputRange      &&
      props.scrollY          
    );

    if(this.isTitleAnimated){
      this._iconScale = Reanimated.interpolate(props.scrollY, {
        inputRange : props.inputRange,
        outputRange: [0.95, 1.05],
        extrapolate: Extrapolate.CLAMP,
      });

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
  };

  render(){
    const { styles } = LargeTitleHeaderCard;
    const { customBody , ...props } = this.props;

    const CompIcon = (this.isTitleAnimated? (
      <Reanimated.Image
        source={props.imageSource}
        style={[styles.iconImage, {
          transform: [
            { scale: this._iconScale },
          ],
        }]}
      />
    ):(
      <Image
        style={styles.iconImage}
        source={props.imageSource}
      />
    ))

    const CompTitle = (this.isTitleAnimated? (
      <Reanimated.View style={{
        height: this._titleHeight,
        opacity: this._titleOpacity,
        transform: [
          { scale: this._titleScale },
          { translateX: this._titleTransX },
        ],
      }}>
        <Text style={styles.textTitle}>
          {props.textTitle}
        </Text>
      </Reanimated.View>
    ):(
      <Text style={styles.textTitle}>
        {props.textTitle}
      </Text>
    ));

    return(
      <View style={[styles.rootContainer, props.addShadow && styles.shadow]}>
        <View style={styles.topContentContainer}>
          <View style={styles.imageTextContainer}>
            {CompIcon}
            <View style={styles.titleBodyContainer}>
              {CompTitle}
              {customBody ?? (
              <Text style={styles.textBody}>
                {props.textBody}
              </Text>
            )}
            </View>
          </View>
        </View>
        {props.children}
      </View>
    );
  };
};