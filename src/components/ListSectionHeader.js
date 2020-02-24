import React, { Fragment } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import throttle from "lodash/throttle";

import * as Animatable from 'react-native-animatable';
import { iOSUIKit } from 'react-native-typography';
import { Feather } from '@expo/vector-icons';

import { ListSortItems        } from 'app/src/components/ListSortItems';
import { ListSortButton       } from 'app/src/components/ListSortButton';
import { TransitionWithHeight } from 'app/src/components/TransitionWithHeight';

import { GREY, BLUE } from 'app/src/constants/Colors';
import { getNextSort, SortKeys } from 'app/src/constants/SortValues';
import { plural } from 'app/src/functions/helpers';


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
      backgroundColor: 'white',
      paddingVertical: 8,
      //borders
      borderColor: GREY[300],
      borderTopWidth: 1,
      borderBottomWidth: 1,
      //shadows
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 7,
      shadowOffset: {
        width: 0,
        height: 7,
      },
    },
    transitionContainer: {
      flexDirection: 'row',
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: 25,
    },
    headerLeftContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    textTitle: {
      ...iOSUIKit.subheadObject,
      textAlignVertical: 'center',
      marginLeft: 7,
    },
    textCount: {
      ...iOSUIKit.subheadEmphasizedObject,
    },
    sortButton: {
      marginRight: 10,
    },
  });

  constructor(props){
    super(props);

    this.state = {
      isSorting: false,
    };
  };

  _handleOnPressSort = throttle(async () => {
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
  }, 750);

  _handleOnLongPressSort = throttle(() => {
    const { onSortExpanded } = this.props;

    this.transitoner.transition(true);
    onSortExpanded && onSortExpanded();
  }, 750);

  _handleOnPressOption = async ({index, sortType, sortValue, isAscending}) => {
    const { onPressSortOption, ...props } = this.props;

    const nextSort = getNextSort(
      index, isAscending,
      props.sortTypes,
    );

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

  _handleOnPressCancel = throttle(() => {
    const { onPressCancel } = this.props;

    this.transitoner.transition(false);
    onPressCancel && onPressCancel();

  }, 750);

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
          color={BLUE.A700}
        />
        <Text style={styles.textTitle}>
          {'Loading...'}
        </Text>
      </Fragment>
    ):(
      <Fragment>
        <Feather
          name={'list'}
          size={20}
          color={BLUE[800]}
        />
        <Text style={styles.textTitle}>
          {'Showing: '}
          <Text style={styles.textCount}>
            {`${itemCount} ${plural('item', itemCount)}`}
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

    return(
      <Animatable.View 
        style={styles.rootContainer}
        ref={r => this.rootContainer = r}
        useNativeDriver={true}
      >
        <TransitionWithHeight
          ref={r => this.transitoner = r}
          containerStyle={styles.transitionContainer}
          handlePointerEvents={true}
          unmountWhenHidden={false}
          heightA={25}
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