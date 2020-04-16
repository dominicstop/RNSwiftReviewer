import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import * as Animatable from 'react-native-animatable';

import { iOSUIKit } from 'react-native-typography';

import { ScreenHeaderOverlay } from 'app/src/components/ScreenHeaderOverlay';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';


class CenterPill extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      borderRadius: 25,
      overflow: 'hidden',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
    },
    textLeft: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      paddingLeft: 12,
      paddingRight: 10,
      paddingVertical: 3,
      fontWeight: '600',
      color: 'white',
      backgroundColor: Helpers.hexToRGBA(Colors.BLUE[800], 0.8),
    },
    textRight: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      fontVariant: ['tabular-nums'],
      paddingLeft: 7,
      paddingRight: 10,
      paddingVertical: 3,
      fontWeight: '800',
      color: Colors.BLUE.A700,
      backgroundColor: 'rgba(255,255,255,0.8)',
    },
  });

  componentDidUpdate(prevProps){
    const nextProps = this.props;

    const prevIndex = prevProps.currentIndex;
    const nextIndex = nextProps.currentIndex;

    // did change
    if(prevIndex != nextIndex){
      this.rootContainerRef.pulse(300);
    };
  };

  render(){
    const { styles } = CenterPill;
    const props = this.props;

    return(
      <Animatable.View 
        style={styles.rootContainer}
        ref={r => this.rootContainerRef = r}
        useNativeDriver={true}
      >
        <Text style={styles.textLeft}>
          {'Question'}
        </Text>
        <Text style={styles.textRight}>
          {`${props.currentIndex ?? 0}/${props.totalCount ?? 0}`}
        </Text>
      </Animatable.View>
    );
  };
};

export class QuizSessionHeader extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    leftContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
    },
    rightContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  render(){
    const { styles } = QuizSessionHeader;
    const { ...props } = this.props;

    return(
      <ScreenHeaderOverlay containerStyle={styles.rootContainer}>
        <View style={styles.leftContainer}>
          <Text>Left</Text>
        </View>
        <View style={styles.centerContainer}>
          <CenterPill
            totalCount={props.totalCount}
            currentIndex={props.currentIndex}
          />
        </View>
        <View style={styles.rightContainer}>
          <Text>Right</Text>
        </View>
      </ScreenHeaderOverlay>
    );
  };
};