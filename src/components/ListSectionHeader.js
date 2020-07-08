import React, { Fragment } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable  from 'react-native-animatable';
import debounce from "lodash/debounce";
import Feather  from 'react-native-vector-icons/Feather';

import { iOSUIKit } from 'react-native-typography';
import { BlurView } from "@react-native-community/blur";

import { ListSortItems        } from 'app/src/components/ListSortItems';
import { ListSortButton       } from 'app/src/components/ListSortButton';
import { TransitionWithHeight } from 'app/src/components/TransitionWithHeight';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import { getNextSort, SortKeys } from 'app/src/constants/SortValues';
import { LIST_SECTION_HEIGHT } from 'app/src/constants/UIValues';


// Section header component that shows item count on the left
// and a sort pill on the right. Expands to show sort options.
// Used to choose sort mode for lists.
export class ListSectionHeader extends React.Component {
  static propTypes = {
    itemCount  : PropTypes.number,
    sortTypes  : PropTypes.object,
    sortValues : PropTypes.object,
    sortIndex  : PropTypes.number,
    isAscending: PropTypes.bool  ,
    // evemt handlers
    onSortExpanded   : PropTypes.func,
    onPressSort      : PropTypes.func,
    onPressCancel    : PropTypes.func,
    onPressSortOption: PropTypes.func,
  };

  static defaultProps = {

  };

  static styles = StyleSheet.create({
    rootContainer: {
      paddingVertical: 8,
      marginBottom: 0,
      //borders
      borderColor: Colors.GREY[300],
      borderTopWidth: 1,
      borderBottomWidth: 1,
      //shadows
      shadowColor: "#000",
      shadowOpacity: 0.10,
      shadowRadius: 7,
      shadowOffset: {
        width: 0,
        height: 7,
      },
    },
    blurBackground: {
      ...StyleSheet.absoluteFillObject,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    transitionContainer: {
      flexDirection: 'row',
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: LIST_SECTION_HEIGHT,
    },
    headerLeftContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    iconContainer: {
      padding: 5,
      backgroundColor: Colors.BLUE[50],
      borderRadius: 5,
    },
    textTitle: {
      ...iOSUIKit.subheadObject,
      fontWeight: '700',
      textAlignVertical: 'center',
      marginLeft: 7,
    },
    textCount: {
      fontWeight: '400',
      color: Colors.GREY[800],
    },
    sortButton: {
      marginRight: 10,
    },
  });

  constructor(props){
    super(props);

    this.state = {
      isSorting: false,
      isExpanded: false,
    };

    this._handleOnPressSort   = debounce(this._handleOnPressSort  , 750, {leading: true});
    this._handleOnPressOption = debounce(this._handleOnPressOption, 750, {leading: true});
    this._handleOnPressCancel = debounce(this._handleOnPressCancel, 750, {leading: true});
  };

  _handleOnPressSort = async () => {
    const { onPressSort, ...props } = this.props;

    const nextSort = getNextSort(
      props.sortIndex  , 
      props.isAscending, 
      props.sortTypes  ,
    );

    // transiton to loading
    this.setState({ isSorting: true });
    await Promise.all([
      this.sortButtonContainer.fadeOutRight(200),
      this.rootContainer.pulse(300),
    ]);

    // wait for sorting to fin
    onPressSort && await onPressSort(
      nextSort.isAsc,
      nextSort.sortByIndex,
    );

    // transiton back
    this.setState({ isSorting: false });
    await Promise.all([
      this.sortButtonContainer.fadeInRight(200),
      this.rootContainer.pulse(300)
    ]);
  };

  _handleOnLongPressSort = () => {
    const { onSortExpanded } = this.props;

    this.setState({ isExpanded: true });
    this.transitoner.transition(true);

    onSortExpanded && onSortExpanded();
  };

  _handleOnPressOption = async ({index, sortType, sortValue, isAscending}) => {
    const { onPressSortOption, ...props } = this.props;

    const nextSort = getNextSort(
      index, isAscending,
      props.sortTypes,
    );

    this.setState({ isExpanded: false });
    await this.transitoner.transition(false);

    // transiton to loading
    this.setState({ isSorting: true });
    await Promise.all([
      this.sortButtonContainer.fadeOutRight(200),
      this.rootContainer.pulse(300),
    ]);

    onPressSortOption && await onPressSortOption(
      nextSort.isAsc,
      nextSort.sortByIndex,
    );

    // transiton back
    this.setState({ isSorting: false });
    await Promise.all([
      this.sortButtonContainer.fadeInRight(200),
      this.rootContainer.pulse(300)
    ]);
  };

  _handleOnPressCancel = () => {
    const { onPressCancel } = this.props;

    this.setState({ isExpanded: false });
    this.transitoner.transition(false);

    onPressCancel && onPressCancel();
  };

  // showing n items + sort btn
  _renderCollapsedHeader(){
    const { styles } = ListSectionHeader;
    const { isSorting } = this.state;
    const { isAscending, ...props } = this.props;

    // get sort type
    const sortTypes  = Object.keys(props.sortTypes);
    const sortType   = sortTypes[props.sortIndex];
    // get sort type name
    const sortValues = props.sortValues[sortType];
    const sortLabel  = sortValues[SortKeys.DISPLAY];

    const itemCount = props.itemCount ?? 0;

    // show loading when sorting and item count when idle
    const LeftComponent = (isSorting? (
      <Fragment>
        <ActivityIndicator 
          size={"small"}
          color={Colors.BLUE.A100}
        />
        <Text style={styles.textTitle}>
          {'Loading...'}
        </Text>
      </Fragment>
    ):(
      <Fragment>
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={this._handleOnLongPressSort}
          activeOpacity={0.75}
        >
          <Feather
            name={'list'}
            size={18}
            color={Colors.BLUE[700]}
          />
        </TouchableOpacity>
        <Text style={styles.textTitle}>
          {'Showing: '}
          <Text style={styles.textCount}>
            {`${itemCount} ${Helpers.plural('item', itemCount)}`}
          </Text>
        </Text>
      </Fragment>
    ));

    return(
      <View style={styles.headerContainer}>
        <View style={styles.headerLeftContainer}>
          {LeftComponent}
        </View>
        <Animatable.View
          ref={r => this.sortButtonContainer = r}
          style={styles.sortButton}
          useNativeDriver={true}
        >
          <ListSortButton
            onPress={this._handleOnPressSort}
            onLongPress={this._handleOnLongPressSort}
            activeOpacity={0.8}
            {...{isAscending, sortLabel}}
          />
        </Animatable.View>
      </View>
    );
  };

  render(){
    const { styles } = ListSectionHeader;
    const { sortTypes, sortValues, sortIndex, isAscending } = this.props;
    const { isExpanded } = this.state;

    const backgroundStyle = {
      backgroundColor: (isExpanded
        ? 'white'
        : 'rgba(255,255,255,0.8)'
      ),
    };

    return(
      <Animatable.View 
        style={styles.rootContainer}
        ref={r => this.rootContainer = r}
        useNativeDriver={true}
      >
        <BlurView
          style={styles.blurBackground}
          blurType={"light"}
          intensity={100}
        />
        <View style={[styles.background, backgroundStyle]}/>
        <TransitionWithHeight
          ref={r => this.transitoner = r}
          containerStyle={styles.transitionContainer}
          handlePointerEvents={true}
          unmountWhenHidden={true}
          heightA={LIST_SECTION_HEIGHT}
        >
          {this._renderCollapsedHeader()}
          <ListSortItems
            onPressOption={this._handleOnPressOption}
            onPressCancel={this._handleOnPressCancel}
            {...{sortTypes, sortValues, sortIndex, isAscending}}
          />
        </TransitionWithHeight>
      </Animatable.View>
    );
  };
};