import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Ionicon  from '@expo/vector-icons/Ionicons';
import debounce from "lodash/debounce";

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
      //borderColor: 'rgba(255,255,255,0.25)',
      //borderWidth: 1,
    },
    textLeft: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      paddingLeft: 12,
      paddingRight: 10,
      paddingVertical: 3,
      fontWeight: '600',
      color: 'white',
      backgroundColor: Helpers.hexToRGBA(Colors.BLUE[900], 0.5),
    },
    textRight: {
      ...iOSUIKit.subheadEmphasizedWhiteObject,
      //fontVariant: ['tabular-nums'],
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
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
    },
    textIconLabel: {
      ...iOSUIKit.subheadEmphasizedWhite,
      alignItems: 'center',
      marginLeft: 7,
    },
  });

  constructor(props){
    super(props);

    this._handleOnPressDone   = debounce(this._handleOnPressDone  , 750, {leading: true});
    this._handleOnPressCancel = debounce(this._handleOnPressCancel, 750, {leading: true});
  };

  _handleOnPressCancel = () => {
    const { onPressCancel } = this.props;
    onPressCancel && onPressCancel();
  };

  _handleOnPressDone = () => {
    const { onPressDone } = this.props;
    onPressDone && onPressDone();
  };

  render(){
    const { styles } = QuizSessionHeader;
    const { ...props } = this.props;

    return(
      <ScreenHeaderOverlay containerStyle={styles.rootContainer}>
        <TouchableOpacity 
          style={styles.leftContainer}
          activeOpacity={0.75}
          onPress={this._handleOnPressCancel}
        >
          <Ionicon
            style={{marginTop: 1}}
            name={'ios-close-circle'}
            size={19}
            color={'white'}
          />
          <Text style={styles.textIconLabel}>
            {'Cancel'}
          </Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <CenterPill
            totalCount={props.totalCount}
            currentIndex={props.currentIndex}
          />
        </View>
        <TouchableOpacity 
          style={styles.rightContainer}
          activeOpacity={0.75}
          onPress={this._handleOnPressDone}
        >
          <Ionicon
            style={{marginTop: 2}}
            name={'ios-checkmark-circle'}
            size={19}
            color={'white'}
          />
          <Text style={styles.textIconLabel}>
            {'Done'}
          </Text>
        </TouchableOpacity>
      </ScreenHeaderOverlay>
    );
  };
};