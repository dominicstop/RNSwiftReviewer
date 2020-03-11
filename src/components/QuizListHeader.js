import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon from '@expo/vector-icons/Ionicons';

import { Divider  } from "react-native-elements";

import { LargeTitleHeaderCard } from 'app/src/components/LargeTitleHeaderCard';
import { ListCardEmpty        } from 'app/src/components/ListCardEmpty';
import { ButtonGradient       } from 'app/src/components/ButtonGradient';


export class QuizListHeader extends React.Component {
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
          <ListCardEmpty
            imageSource={require('app/assets/icons/pencil_sky.png')}
            title={"No quizes to show"}
            subtitle={"Oops, looks like this place is empty! To get started, press the create quiz button to add something here."}
          />
        )}
      </Fragment>
    );
  };
};