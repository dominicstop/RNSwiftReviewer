import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import { ModalDragIndicator } from 'app/src/components/Modal/ModalDragIndicator';

import * as Colors from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { MODAL_HEADER_HEIGHT, BORDER_WIDTH } from 'app/src/constants/UIValues';


const styles = StyleSheet.create({
  rootContainer: {
    height: MODAL_HEADER_HEIGHT,
    //float top
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  headerWrapper: {
    flex: 1,
    backgroundColor: Helpers.hexToRGBA(Colors.INDIGO.A700, 0.8),
    alignItems: 'center',
    borderColor: Colors.GREY[400],
    borderBottomWidth: BORDER_WIDTH,
  },
  headerContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 3,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 38/2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  iconStyle: {
    shadowColor: 'rgba(255,255,255,0.5)',
    shadowRadius: 7,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textTitle: {
    ...iOSUIKit.subheadEmphasizedObject,
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
  },
  textSubtitle: {
    ...iOSUIKit.subheadObject,
    color: 'white',
    opacity: 0.9,
  },
});

// Used in ModalBody props: modalHeader
// Displays a Icon, title/subtitle on the top of the modal
export class ModalHeader extends React.PureComponent {
  static propTypes = {
    title          : PropTypes.string ,
    subtitle       : PropTypes.string ,
    headerIcon     : PropTypes.element,
    rightHeaderItem: PropTypes.element,
    containerStyle : PropTypes.object ,
  };

  static defaultProps = {
    title   : 'Title N/A',
    subtitle: 'Subtitle N/A',
  };

  render(){
    const { headerIcon, ...props } = this.props;

    const LeftHeaderIcon = (
      <View style={styles.iconContainer}>
        <View style={styles.iconStyle}>
          {React.cloneElement(headerIcon, {
            color: Colors.BLUE.A700
          })}
        </View>
      </View>
    );

    return(
      <View style={styles.rootContainer}>
        <BlurView
          style={styles.blurBackground}
          blurType={'light'}
        />
        <View style={[styles.headerWrapper, props.containerStyle]}>
          <ModalDragIndicator/>
          <View style={styles.headerContainer}>
            {LeftHeaderIcon}
            <View style={styles.headerTextContainer}>
              <Text style={styles.textTitle}>
                {props.title}
              </Text>
              <Text 
                style={styles.textSubtitle}
                numberOfLines={1}
              >
                {props.subtitle}
              </Text>
            </View>
            {this.props.rightHeaderItem}
          </View>
        </View>
      </View>
    );
  };
};