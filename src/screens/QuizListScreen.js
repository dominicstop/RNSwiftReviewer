import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { ROUTES } from 'app/src/constants/Routes';
import { ModalController } from 'app/src/functions/ModalController';


import Reanimated from "react-native-reanimated";
import { ScrollView } from 'react-native-gesture-handler';

import { LargeTitleWithSnap } from 'app/src/components/LargeTitleFlatList';

const ReanimatedFlatList = Reanimated.createAnimatedComponent(
  FlatList
);

export class QuizListScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'blue',
    },
    headerContainer: {
      position: 'absolute',
      backgroundColor: 'red',
      width: '100%',
      height: 100,
    },
    scrollview: {
      flex: 1,
    },
  });

  static navigationOptions = {
    title: 'Quiz'
  };

  _handleOnPressNavigate = () => {
    ModalController.showModal();
  };

  render() {
    const { styles } = QuizListScreen;

    return (
      <View style={styles.rootContainer}>
        <LargeTitleWithSnap
          titleText={'Quizes'}
          subtitleText={'Your Quiz Reviewers'}
          showSubtitle={true}
        >
          <ReanimatedFlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}
            renderItem={({item}) => (
              <View style={{backgroundColor: 'red', padding: 20}}>
                <Text>{item}</Text>
              </View>
            )}
            keyExtractor={item => item}
          />
        </LargeTitleWithSnap>
      </View>
    );
  };
};

