import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import { ModalSection } from 'app/src/components/ModalSection';


import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';
import { ImageTitleSubtitle } from '../ImageTitleSubtitle';

export class ViewQuizSessionList extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: 'rgba(255,255,255,0.6)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    rootContainerEmpty: {
      paddingVertical: 25,
      paddingHorizontal: 13,
    },
  });

  render(){
    const { styles } = ViewQuizSessionList;
    const { isEmptyCard } = this.props;

    return (isEmptyCard? (
      <ModalSection
        containerStyle={styles.rootContainerEmpty}
        showBorderTop={false}
        hasMarginBottom={false}
      >
        <ImageTitleSubtitle
          hasPadding={false}
          imageSource={require('app/assets/icons/e-test-tube.png')}
          title={"No Sessions to show"}
          subtitle={"Oops, looks like you haven't taken this quiz yet. You can take this quiz by tapping the \"Start Quiz\" button."}
        />
      </ModalSection>
    ):(
      <View style={styles.rootContainer}>
        <Text>To Be Implemented</Text>
      </View>
    ));
  };
};