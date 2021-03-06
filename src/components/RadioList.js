import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';
import Ionicon  from 'react-native-vector-icons/Ionicons';

import * as Animatable from 'react-native-animatable';

import * as Colors from 'app/src/constants/Colors';

export const RadioListKeys = {
  title   : 'title'    , // display title
  desc    : 'desc'     , // display desc
  descLong: 'descLong' , // display detailed desc
  type    : 'type'     , // enum string
};


class ListSortItem extends React.Component {
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
      left: -100,
      right: -100,
      backgroundColor: Colors.BLUE[50],
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
      color: Colors.GREY[900],
    },
    itemDesc: {
      fontSize: 15,
      fontWeight: '300',
      color: Colors.GREY[700],
    },
    iconArrowContainer: {
      width: 27,
      height: 27,
      borderRadius: 27/2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.BLUE[100],
    },
    //#endregion
  });

  constructor(props){
    super(props);

    this._handleOnPress = debounce(this._handleOnPress, 750, {leading: true});
  };

  _handleOnPress = () => {
    const { onPressListItem, index, selectedType, ...props } = this.props;

    const title = props[RadioListKeys.title];
    const desc  = props[RadioListKeys.desc ];
    const type  = props[RadioListKeys.type ];

    onPressListItem && onPressListItem(
      { index, title, desc, type }
    );

    this.radioButtonContainerRef.pulse(300);
  };

  render(){
    const { styles } = ListSortItem;
    const { index, selectedType, listItemsCount, ...props } = this.props;

    const title = props[RadioListKeys.title] ?? 'Title N/A';
    const desc  = props[RadioListKeys.desc ] ?? 'Description N/A';
    const type  = props[RadioListKeys.type ];

    const isFirst    = (index == 0);
    const isLast     = (index == (listItemsCount - 1));
    const isSelected = (type  == selectedType);

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
          color={Colors.BLUE.A700}
        />
      </Animatable.View>
    ) : (
      <Ionicon
        name={'ios-radio-button-off'}
        type={'ionicon'}
        size={25}
        color={Colors.BLUE.A200}
      />
    ));

    const itemContainerStyle = {
      ...(!isFirst && styles.itemSeperator),
      ...( isFirst && { paddingTop   : props.paddingTop    }),
      ...( isLast  && { paddingBottom: props.paddingBottom }),
    };

    return(
      <Animatable.View
        ref={r => this.radioButtonContainerRef = r}
        useNativeDriver={true}
      >
        <TouchableOpacity
          onPress={this._handleOnPress}
          activeOpacity={0.8}
          {...props}
        >
          <View style={[styles.itemContainer, itemContainerStyle]}>
            {isSelected && (
              <Animatable.View 
                style={styles.background}
                animation={'breathe'}
                iterationCount={'infinite'}
                delay={500}
                duration={3000}
                iterationDelay={1000}
                useNativeDriver={true}
              />
            )}
            
            {RadioButton}
            <View style={styles.itemTitleContainer}>
              <Text style={styles.itemTitle}>
                <Text style={styles.itemTitleLabel}>{
                  `${index + 1}. `}
                </Text>
                {title}
              </Text>
              <Text style={styles.itemDesc}>
                {desc}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
};

export class RadioList extends React.Component {
  static propTypes = {
    enumTypes     : PropTypes.object,
    listItems     : PropTypes.object,
    selectedType  : PropTypes.string,
    containerStyle: PropTypes.object,
    // event handlers
    onPressListItem: PropTypes.func,
  };

  static styles = StyleSheet.create({

  });

  render(){
    const { styles } = RadioList;
    const { onPressListItem, selectedType, ...props } = this.props;

    const listItems = Object.entries(props.listItems);

    return (
      <View style={[styles.rootContainer, props.containerStyle]}>
        {listItems.map(([radioListType, values], index) => (
          <ListSortItem
            key={`${radioListType}-${index}`}
            listItemsCount={listItems.length}
            paddingBottom={12}
            // pass down  values
            {...{index, onPressListItem, selectedType, ...values}}
          />
        ))}
      </View>
    );
  };
};