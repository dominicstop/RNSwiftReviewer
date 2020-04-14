import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Clipboard } from 'react-native';

import { FlatListCarousel } from 'app/src/components/QuizSessionScreen/FlatListCarousel';

import * as Helpers from 'app/src/functions/helpers';

const DUMMY_DATA = [
  { key: 1  },
  { key: 2  },
  { key: 3  },
  { key: 4  },
  { key: 5  },
  { key: 6  },
  { key: 7  },
  { key: 8  },
  { key: 9  },
  { key: 10 },
  { key: 11 },
  { key: 12 },
  { key: 13 },
  { key: 14 },
  { key: 15 },
  { key: 16 },
  { key: 17 },
  { key: 18 },
  { key: 19 },
];

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

const ITEM_HEIGHT = screenHeight;
const ITEM_WIDTH  = screenWidth;

class QuizQuestionItem extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center'
    },
  });

  render(){
    const { styles } = QuizQuestionItem;
    const { index } = this.props;

    const rootContainerStyle = {
      backgroundColor: ((index % 2 == 0)
        ? 'red'
        : 'green'
      ),
    };

    return(
      <View style={[styles.rootContainer, rootContainerStyle]}>
        <Text style={{fontSize: 64}}>{index}</Text>
      </View>
    );
  };
};

export class QuizSessionScreen extends React.Component {
  static navigationOptions = {
    title: 'N/A',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    flatList: {
      flex: 1,
    },
  });

  constructor(props){
    super(props);

    this.state = {
      currentIndex: 0,
    };
  };

  _handleSnap = ({index}) => {
    this.setState({
      currentIndex: index
    });
  };

  _handleOnBeforeSnap = ({nextIndex}) => {
    this.setState({
      currentIndex: nextIndex,
    });
  };

  _renderItem = ({item, index}) => {
    return(
      <QuizQuestionItem
        {...{index}}
      />
    );
  };

  render(){
    const { styles } = QuizSessionScreen;
    const { currentIndex } = this.state;

    return(
      <View style={styles.rootContainer}>
        <FlatListCarousel
          data={DUMMY_DATA}
          renderItem={this._renderItem}
          onSnap={this._handleSnap}
          onBeforeSnap={this._handleOnBeforeSnap}
        />
        <Text style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          fontSize: 30
        }}>
          {currentIndex}
        </Text>
      </View>
    );
  };
};