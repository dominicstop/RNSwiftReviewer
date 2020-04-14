import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import * as Helpers from 'app/src/functions/helpers';

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

const ITEM_WIDTH  = screenWidth ;
const ITEM_HEIGHT = screenHeight;

export class FlatListCarousel extends React.PureComponent {

  constructor(props){
    super(props);

    this.scrollY = 0;
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

    console.log(`\n_handleOnMomentumScrollEnd: ${scrollY}`);
    console.log(`currentIndex: ${onSnap}`);

    onSnap && onSnap({
      index: currentIndex
    });
  };

  _handleGetItemLayout = (data, index) => ({
    index,
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
  });

  _renderItem = ({item, index}) => {
    const { renderItem } = this.props;

    return(
      <View>
        {renderItem && renderItem({item, index})}
      </View>
    );
  };

  render(){
    const props = this.props;

    return(
      <FlatList
        ref={r => this.flatlistRef = r}
        style={styles.flatList}
        renderItem={this._renderItem}
        keyExtractor={item => item.key}
        snapToAlignment={'center'}
        decelerationRate={'fast'}
        overScrollMode={'never'}
        disableIntervalMomentum={true}
        directionalLockEnabled={true}
        disableScrollViewPanResponder={true}
        scrollEventThrottle={500}
        pagingEnabled={true}
        onScrollEndDrag={this._handleOnScrollEndDrag}
        onScroll={this._handleOnScroll}
        onMomentumScrollEnd={this._handleOnMomentumScrollEnd}
        {...props}
      />
    );
  };
};

const styles = StyleSheet.create({

});