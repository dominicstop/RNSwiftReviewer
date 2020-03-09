import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon from '@expo/vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

import { iOSUIKit } from 'react-native-typography';
import { Divider  } from 'react-native-elements';

import { BLUE, GREY } from 'app/src/constants/Colors';
import { SortKeys } from 'app/src/constants/SortValues';

class ListSortItem extends React.Component {
  static propTypes = {
    index      : PropTypes.number, // sort index
    sortType   : PropTypes.string, // sort type enum
    sortValue  : PropTypes.object, // sort details i.e title, desc etc.
    sortIndex  : PropTypes.number, // current sort type
    isAscending: PropTypes.bool  ,
    // event handlers
    onPressOption: PropTypes.func,
    onPressCancel: PropTypes.func,
  };

  static styles = StyleSheet.create({
    //#region --- Render Item Styles
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: 10,
      marginHorizontal: 10,
      alignItems: 'center',
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      left: -10,
      right: -10,
      backgroundColor: BLUE[50],
    },
    itemSeperator: {
      borderColor: 'rgba(0,0,0,0.15)',
      borderTopWidth: 1,
    },
    itemTitleContainer: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: '500',
    },
    itemTitleLabel: {
      fontWeight: '800',
      color: GREY[900],
    },
    itemDesc: {
      fontSize: 15,
      fontWeight: '300',
      color: GREY[700],
    },
    iconArrowContainer: {
      width: 27,
      height: 27,
      borderRadius: 27/2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: BLUE[100],
    },
    //#endregion
  });

  _handleOnPress = () => {
    const { onPressOption, index, sortIndex, ...props } = this.props;
    const isSelected  = (index == sortIndex);

    onPressOption && onPressOption({
      index, 
      sortType : props.sortType ,
      sortValue: props.sortValue,
      // if not selected, give default
      isAscending: (isSelected
        ? props.isAscending
        : false
      ),
    });
  };

  render(){
    const { styles } = ListSortItem;
    const { index, sortIndex, sortType, sortValue, ...props } = this.props;

    const isFirst    = (index == 0);
    const isSelected = (index == sortIndex);

    const sortTitle = sortValue[SortKeys.TITLE] ?? 'Sort Type';
    const sortDesc  = sortValue[SortKeys.DESC ] ?? 'Sort Desc';

    const RadioButton = (isSelected? (
      <Animatable.View
        animation={'pulse'}
        duration={3000}
        iterationDelay={1000}
        iterationCount={'infinite'}
        easing={'ease-in-out'}
        useNativeDriver={true}
      >
        <Ionicon
          name={'ios-radio-button-on'}
          type={'ionicon'}
          size={25}
          color={BLUE.A700}
        />
      </Animatable.View>
    ) : (
      <Ionicon
        name={'ios-radio-button-off'}
        type={'ionicon'}
        size={25}
        color={BLUE.A200}
      />
    ));

    return(
      <TouchableOpacity
        onPress={this._handleOnPress}
        activeOpacity={0.8}
        {...props}
      >
        <View style={[styles.itemContainer, (!isFirst && styles.itemSeperator)]}>
          {isSelected && (
            <Animatable.View 
              style={styles.background}
              animation={'breathe'}
              iterationCount={'infinite'}
              delay={1000}
              duration={3000}
              iterationDelay={2000}
              useNativeDriver={true}
            />
          )}
          {RadioButton}
          <View style={styles.itemTitleContainer}>
            <Text style={styles.itemTitle}>
              <Text style={styles.itemTitleLabel}>{
                `${index + 1}. `}
              </Text>
              {sortTitle}
            </Text>
            <Text style={styles.itemDesc}>
              {sortDesc}
            </Text>
          </View>
          {isSelected && (
            <Animatable.View
              style={styles.iconArrowContainer}
              animation={'fadeInRight'}
              duration={750}
              delay={250}
              easing={'ease-in-out'}
              useNativeDriver={true}
            >
              <Ionicon
                style={{ marginTop: 2 }}
                name={(props.isAscending? 'md-arrow-up' : 'md-arrow-down')}
                type={'feather'}
                color={BLUE[800]}
                size={20}
              />
            </Animatable.View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
};

export class ListSortItems extends React.Component {
  static propTypes = {
    sortTypes  : PropTypes.object,
    sortValues : PropTypes.object,
    sortIndex  : PropTypes.number,
    isAscending: PropTypes.bool  ,
    // evemt handlers
    onSortExpanded: PropTypes.func,
    onPressSort   : PropTypes.func,
  };

  static styles = StyleSheet.create({
    //#region --- Header Styles
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      //borderColor: 'rgba(0,0,0,0.2)',
      //borderBottomWidth: 1,
    },
    headerTitle: {
      flex: 1,
      fontWeight: '700',
      fontSize: 19,
    },
    closeButton: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 15,
      backgroundColor: BLUE.A100
    },
    closeButtonText: {
      ...iOSUIKit.subheadEmphasized,
      color: BLUE[900],
      fontWeight: '900',
    },
    //#endregion
    divider: {
      marginHorizontal: 10,
      marginTop: 10,
    },
  });

  _renderHeader(){
    const { styles } = ListSortItems;
    const props = this.props;

    return(
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {'Sort Items By'}
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={props.onPressCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>
            {'Cancel'}
          </Text> 
        </TouchableOpacity>
      </View>
    );
  };

  _renderItems(){
    const { onPressOption, sortValues, sortIndex, isAscending } = this.props;

    const sortItems = Object.entries(sortValues);

    return sortItems.map(([sortType, sortValue], index) => (
      <ListSortItem
        key={`${sortType}-${index}`}
        {...{
          // pass down sortItem map values
          sortType, sortValue, index,
          // pass down props
          onPressOption, sortIndex, isAscending
        }}
      />
    ));
  };

  render(){
    const { styles } = ListSortItems;
    return(
      <Fragment>
        {this._renderHeader()}
        <Divider style={styles.divider}/>
        {this._renderItems()}
      </Fragment>
    );
  };
};