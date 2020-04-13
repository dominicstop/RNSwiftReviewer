import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';
import { BlurView } from "@react-native-community/blur";
import { iOSUIKit } from 'react-native-typography';

import { MODAL_HEADER_HEIGHT } from 'app/src/constants/UIValues';
import * as Colors from 'app/src/constants/Colors';


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
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    paddingTop: 7,
    borderColor: Colors.GREY[300],
    borderBottomWidth: 1,
  },
  dragIndicator: {
    width: 40,
    height: 6,
    backgroundColor: Colors.BLUE[900],
    borderRadius: 10,
    opacity: 0.25,
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
    backgroundColor: Colors.INDIGO.A700,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  iconStyle: {
    shadowColor: 'white',
    shadowRadius: 7,
    shadowOpacity: 0.5,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 9,
  },
  textTitle: {
    ...iOSUIKit.subheadEmphasizedObject,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.INDIGO[1000],
  },
  textSubtitle: {
    ...iOSUIKit.subheadObject,
    opacity: 0.75,
  },
});

// Used in ModalBackground props: modalHeader
// Displays a Icon, title/subtitle on the top of the modal
export class ModalHeader extends React.PureComponent {
  static propTypes = {
    title         : PropTypes.string ,
    subtitle      : PropTypes.string ,
    LeftHeaderIcon: PropTypes.element,
    containerStyle: PropTypes.object ,
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
          {headerIcon}
        </View>
      </View>
    );

    return(
      <View style={styles.rootContainer}>
        <BlurView
          style={styles.blurBackground}
          blurAmount={50}
          blurType={'light'}
        />
        <View style={[styles.headerWrapper, props.containerStyle]}>
          <Animatable.View 
            style={styles.dragIndicator}
            animation={'pulse'}
            duration={2000}
            iterationCount={'infinite'}
            iterationDelay={2000}
            useNativeDriver={true}
          />
          <View style={styles.headerContainer}>
            {LeftHeaderIcon}
            <View style={styles.headerTextContainer}>
              <Text style={styles.textTitle}>
                {props.title}
              </Text>
              <Text style={styles.textSubtitle}>
                {props.subtitle}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
};