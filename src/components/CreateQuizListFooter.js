import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Animatable from 'react-native-animatable';

import   Ionicon    from '@expo/vector-icons/Ionicons';
import { Divider  } from "react-native-elements";

import { ButtonGradient         } from 'app/src/components/ButtonGradient';
import { ImageTitleSubtitleCard } from 'app/src/components/ImageTitleSubtitleCard';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';


const TextConstants = {
  // ImageTitleSubtitleCard subtitle
  EmptyText: Helpers.sizeSelectSimple({
    normal: "There are different types of sections. (Example: matching type, multiple choice etc.)",
    large : "There are different types of sections with different answer methods (Example: matching type, multiple choice etc.)",
  }),
};


export class CreateQuizListFooter extends React.Component {
  static propTypes = {

  };

  static defaultProps = {
  };

  static styles = StyleSheet.create({
    rootContainer: {
      paddingBottom: 5,
      paddingHorizontal: 10,
    },
    headerButton: {
      marginBottom: 0,
    },
    divider: {
      marginTop: 15,
      marginHorizontal: 15,
    },
  });

  render(){
    const { styles } = CreateQuizListFooter;
    const props = this.props;

    return(
      <Animatable.View
        animation={'fadeInUp'}
        duration={300}
        useNativeDriver={true}
      >
        <ImageTitleSubtitleCard
          imageSource={require('app/assets/icons/e-window-msg.png')}
          title={"Insert New Section"}
          subtitle={TextConstants.EmptyText}
        >
          <Divider style={styles.divider}/>
          <ButtonGradient
            containerStyle={styles.headerButton}
            bgColor={Colors.BLUE[100]}
            fgColor={Colors.BLUE['A700']}
            alignment={'CENTER'}
            title={'Add New Section'}
            onPress={props.onPressAddSection}
            iconDistance={10}
            isBgGradient={false}
            addShadow={false}
            showIcon={true}
            leftIcon={(
              <Ionicon
                name={'ios-add-circle'}
                color={Colors.BLUE['A700']}
                size={25}
              />
            )}
          />
        </ImageTitleSubtitleCard>
      </Animatable.View>
    );
  };
};