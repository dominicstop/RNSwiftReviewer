import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon from '@expo/vector-icons/Ionicons';
import { Divider } from "react-native-elements";

import { LargeTitleHeaderCard   } from 'app/src/components/LargeTitleHeaderCard';
import { ImageTitleSubtitleCard } from 'app/src/components/ImageTitleSubtitleCard';
import { ButtonGradient         } from 'app/src/components/ButtonGradient';

import * as Helpers from 'app/src/functions/helpers';

const TextConstants = {
  HeaderBody: Helpers.sizeSelectSimple({
    normal: "Here are all the quizes you've created. Tap on an item to view the details about the quiz.",
    large : `Here are all the quizes that you've created so far. Tap on an item to view the details about that quiz. Or you can create a new quiz.`,
  }),
};


// used in components/QuizListScreen
// LargeTitleWithSnap: renderHeader comp
// shows button for create quiz, displays empty card when no items
export class QuizListHeader extends React.PureComponent {
  static propTypes = {
    itemCount : PropTypes.number,
    scrollY   : PropTypes.object,
    inputRange: PropTypes.array ,
    // events
    onPressCreateQuiz: PropTypes.func,
  };

  static styles = StyleSheet.create({
    divider: {
      marginTop: 15,
      marginHorizontal: 15,
    },
    headerButton: {
      marginTop: 10,
      marginBottom: 10
    },
  });

  render() {
    const { styles } = QuizListHeader;
    const { itemCount, ...props } = this.props;

    const addShadow = (itemCount == 0);

    return(
      <Fragment>
        <LargeTitleHeaderCard
          imageSource={require('app/assets/icons/circle_paper_pencil.png')}
          isTitleAnimated={true}
          textTitle={'Your Quizes'}
          textBody={TextConstants.HeaderBody}
          scrollY={props.scrollY}
          inputRange={props.inputRange}
          {...{addShadow}}
        >
          <Divider style={styles.divider}/>
          <ButtonGradient
            containerStyle={styles.headerButton}
            title={'Create Quiz'}
            subtitle={'Create a new quiz item'}
            onPress={props.onPressCreateQuiz}
            iconType={'ionicon'}
            iconDistance={10}
            isBgGradient={true}
            showChevron={true}
            showIcon={true}
            leftIcon={(
              <Ionicon
                name={'ios-add-circle'}
                color={'white'}
                size={22}
              />
            )}
          />
        </LargeTitleHeaderCard>
        {(itemCount == 0) && (
          <ImageTitleSubtitleCard
            imageSource={require('app/assets/icons/pencil_sky.png')}
            title={"No quizes to show"}
            subtitle={"Oops, looks like this place is empty! To get started, press the create quiz button to add something here."}
          />
        )}
      </Fragment>
    );
  };
};