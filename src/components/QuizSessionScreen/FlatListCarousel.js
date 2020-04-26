import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import * as Helpers from 'app/src/functions/helpers';

import { HeaderValues } from 'app/src/constants/HeaderValues';
import { INSET_BOTTOM } from 'app/src/constants/UIValues';

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

const ITEM_WIDTH  = screenWidth;
const ITEM_HEIGHT = screenHeight;

const spaceTop    = HeaderValues.getHeaderHeight(true);
const spaceBottom = INSET_BOTTOM;

export class FlatListCarousel extends React.PureComponent {

  constructor(props){
    super(props);

    this.scrollY = 0;
  };

  async componentDidMount(){
    const { innerRef } = this.props;
    innerRef && innerRef(this.flatlistRef);

    await Helpers.timeout(50);
    this.flatlistRef.scrollToOffset({
      animated: true,
      offset: 0,
    });
  };
  
  getProps(){
    const { renderItem, ...props } = this.props;

    return props;
  };

  _handleOnScrollEndDrag = async ({nativeEvent}) => {
    const { onBeforeSnap } = this.props;
    const { contentOffset: {y} } = nativeEvent;

    const scrollY      = ((y < 0)? 0 : y);
    const currentIndex = Math.round(scrollY / ITEM_HEIGHT);

    onBeforeSnap && onBeforeSnap({
      prevIndex: this.currentIndex,
      nextIndex: currentIndex,
    });

    this.scrollY = scrollY;
    this.flatlistRef.setNativeProps({scrollEnabled: false });

    await Helpers.timeout(250);
    this.flatlistRef.setNativeProps({ scrollEnabled: true });
  };

  _handleOnScroll = ({nativeEvent}) => {
    const { contentOffset } = nativeEvent;
    this.scrollY = contentOffset.y;
  };

  _handleOnMomentumScrollEnd = ({nativeEvent}) => {
    const { onSnap } = this.props;
    const { contentOffset: {y} } = nativeEvent;

    const scrollY      = ((y < 0)? 0 : y);
    const currentIndex = Math.round(scrollY / ITEM_HEIGHT);

    this.scrollY      = scrollY;
    this.currentIndex = currentIndex;

    onSnap && onSnap({
      index: currentIndex
    });

    if(y < 0 && this.flatlistRef){
      this.flatlistRef.scrollToOffset({
        animated: true,
        offset: 0,
      });
    };
  };

  _handleGetItemLayout = (data, index) => ({
    index,
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
  });

  _renderItem = ({item, index}) => {
    const { renderItem } = this.props;

    return(
      <View style={styles.itemContainer}>
        {renderItem && renderItem({item, index})}
      </View>
    );
  };

  render(){
    const props = this.getProps();

    const data  = props.data;
    const count = data?.length ?? 0;

    const flatlistProps = {
      ...((count <= 1)? {
        snapToInterval : ITEM_HEIGHT,
        snapToAlignment: 'center'   ,
      }:{
        pagingEnabled: true,
      })
    };

    return(
      <FlatList
        ref={r => this.flatlistRef = r}
        style={styles.flatList}
        renderItem={this._renderItem}
        decelerationRate={'fast'}
        overScrollMode={'never'}
        keyboardDismissMode={'on-drag'}
        nestedScrollEnabled={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        scrollsToTop={false}
        disableIntervalMomentum={true}
        directionalLockEnabled={true}
        disableScrollViewPanResponder={true}
        scrollEventThrottle={750}
        getItemLayout={this._handleGetItemLayout}
        onScrollEndDrag={this._handleOnScrollEndDrag}
        onScroll={this._handleOnScroll}
        onMomentumScrollEnd={this._handleOnMomentumScrollEnd}
        scrollIndicatorInsets={{
          top   : spaceTop,
          bottom: spaceBottom
        }}
        {...props}
        {...flatlistProps}
      />
    );
  };
};

const styles = StyleSheet.create({
  itemContainer: {
    height       : ITEM_HEIGHT,
    width        : ITEM_WIDTH ,
    paddingTop   : spaceTop   ,
    paddingBottom: spaceBottom,
  },
});