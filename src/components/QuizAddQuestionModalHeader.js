import React from 'react';
import { StyleSheet, SectionList, Text, View, TouchableOpacity, Dimensions } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';

import { Navigation } from 'react-native-navigation';
import { Divider } from 'react-native-elements';
import { iOSUIKit } from 'react-native-typography';
import { createNativeWrapper } from 'react-native-gesture-handler';

import { ModalSection       } from 'app/src/components/Modal/ModalSection';
import { ImageTitleSubtitle } from 'app/src/components/ImageTitleSubtitle';
import { ButtonGradient     } from 'app/src/components/ButtonGradient';

import { QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';


export class QuizAddQuestionModalHeader extends React.PureComponent {
  static styles = StyleSheet.create({
    buttonAddSectionEmpty: {
      paddingHorizontal: 0,
      margin: 0,
    },
    buttonAddSection: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      margin: 0,
    },
    divider: {
      margin: 12,
    },
  });

  constructor(props){
    super(props);
  };

  _renderEmpty(){
    const { styles } = QuizAddQuestionModalHeader;
    const props = this.props;

    const sectionTitle = props[QuizSectionKeys.sectionTitle];
    
    return(
      <ModalSection showBorderTop={false}>
        <ImageTitleSubtitle
          containerStyle={styles.buttonAddSectionEmpty}
          title={'Looks A Bit Empty'}
          subtitle={`${sectionTitle} doesn't have any questions yet. Add some to get started.`}
          imageSource={require('app/assets/icons/lbw-spacecraft-laptop.png')}
        />
        <Divider style={styles.divider}/>
        <ButtonGradient
          containerStyle={styles.buttonAddSectionEmpty}
          bgColor={Colors.BLUE[100]}
          fgColor={Colors.BLUE['A700']}
          alignment={'CENTER'}
          title={'Add New Question'}
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
      </ModalSection>
    );
  };

  _renderHeader(){
    const { styles } = QuizAddQuestionModalHeader;
    const props = this.props;

    const sectionTitle = props[QuizSectionKeys.sectionTitle];

    return(
      <ModalSection showBorderTop={false}>
        <ImageTitleSubtitle
          containerStyle={styles.buttonAddSection}
          title={`${sectionTitle} Section`}
          subtitle={`Add questions to this section. Tap on a question to edit or swipe on a question to delete it.`}
          imageSource={require('app/assets/icons/e-telescope.png')}
        />
      </ModalSection>
    );
  };

  render(){
    const props = this.props;

    const questions = props[QuizSectionKeys.sectionQuestions] ?? [];
    const count     = questions.length;

    return ((count <= 0)
      ? this._renderEmpty ()
      : this._renderHeader()
    );
  };
};