import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon from '@expo/vector-icons/Ionicons';

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
      paddingVertical: 7,
      alignItems: 'center',
    },
    itemSeperator: {
      borderColor: 'rgba(0,0,0,0.2)',
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
      color: GREY[800],
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
          
    const [name, color] = (isSelected
      ? ['ios-radio-button-on' , BLUE.A400]
      : ['ios-radio-button-off', BLUE.A200]
    );

    return(
      <TouchableOpacity
        onPress={this._handleOnPress}
        activeOpacity={0.8}
        {...props}
      >
        <View style={[styles.itemContainer, (!isFirst && styles.itemSeperator)]}>
          <Ionicon
            type={'ionicon'}
            size={25}
            {...{name, color}}
          />
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
            <Ionicon
              containerStyle={styles.iconContainer}
              name={(props.isAscending? 'md-arrow-up' : 'md-arrow-down')}
              type={'feather'}
              color={BLUE.A200}
              size={22}
            />
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
      margin: 10,
    },
    sortItemsContainer: {
      paddingHorizontal: 10,
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
            {'Cancel'
          }</Text> 
        </TouchableOpacity>
      </View>
    );
  };

  _renderItems(){
    const { onPressOption, sortValues, sortIndex, isAscending } = this.props;

    const sortItems = Object.entries(sortValues);

    return sortItems.map(([sortType, sortValue], index) => (
      <ListSortItem
        {...{onPressOption, sortType, sortValue, index, sortIndex, isAscending}}
      />
    ));
  };

  render(){
    const { styles } = ListSortItems;
    return(
      <Fragment>
        {this._renderHeader()}
        <Divider style={styles.divider}/>
        <View style={styles.sortItemsContainer}>
          {this._renderItems()}
        </View>
      </Fragment>
    );
  };
};