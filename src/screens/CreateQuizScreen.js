import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { LargeTitleWithSnap   } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon   } from 'app/src/components/LargeTitleFadeIcon';
import { ButtonGradient       } from 'app/src/components/ButtonGradient';
import { REASectionList       } from 'app/src/components/ReanimatedComps';
import { ScreenFooter         } from 'app/src/components/ScreenFooter';
import { CreateQuizListItem   } from 'app/src/components/CreateQuizListItem';
import { CreateQuizListHeader } from 'app/src/components/CreateQuizListHeader';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { RNN_ROUTES, ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz } from 'app/src/constants/NavParams';

import { ModalController } from 'app/src/functions/ModalController';
import { QuizModel, QuizKeys } from 'app/src/models/QuizModel';


export class CreateQuizScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    divider: {
      marginTop: 15,
      marginHorizontal: 15,
    },
    headerButton: {
      marginTop: 10,
      marginBottom: 10
    },
  });

  static navigationOptions = {
    title: 'Create Quiz',
    headerTitle: null,
    headerShown: true,
    headerBackground: null,
  };

  constructor(props){
    super(props);

    const { params } = props.navigation.state;

    this.quiz = new QuizModel();
    
    // save passed nav params from prev. screen to model
    this.quiz.title = params[SNPCreateQuiz.quizTitle];
    this.quiz.desc  = params[SNPCreateQuiz.quizDesc ];

    // init date created
    this.quiz.setDateCreated();

    this.state = {
      scrollEnabled: true,
      isAsc: false,
      sortIndex: 0,
      // pass down def. values from quizes
      ...this.quiz.values,
    };
  };

  _handleOnPressAddSection = () => {
    this.footerRef.setVisibilty(true);

    this.quiz.addSection({});
    this.setState({ ...this.quiz.values });
  };

  //todo
  // #region - event handlers / callbacks
  _handleKeyExtractor = (quiz, index) => {
    return quiz[QuizKeys.quizID];
  };

  //todo
  _handleOnPressSectionItem = ({section, index}) => {
    //ModalController.showModal({
    //  routeName: RNN_ROUTES.RNNModalViewQuiz
    //});
  };
  //#endregion

  // #region - render functions
  _renderListHeader = ({scrollY, inputRange}) => {

    // get quiz title/desc from state
    const quizTitle = this.state[QuizKeys.quizTitle] ?? 'Title N/A';
    const quizDesc  = this.state[QuizKeys.quizDesc ] ?? 'No Description to show.';
    
    // get section item count
    const sections  = this.state[QuizKeys.quizSections];
    const itemCount = sections?.length ?? 0;

    return(
      <CreateQuizListHeader
        onPressEditQuiz={this._handleOnPressEditQuiz}
        onPressAddSection={this._handleOnPressAddSection}
        // pass down as props
        {...{quizTitle, quizDesc, itemCount}}
        // pass down LargeTitleWithSnap params
        {...{scrollY, inputRange}}
      />
    );
  };

  // section list footer card
  _renderListFooter = () => {

  };
  
  // receives params from LargeTitleWithSnap comp
  // section list header card
  _renderTitleIcon = ({scrollY, inputRange}) => {
    return(
      <LargeTitleFadeIcon 
        style={{marginTop: 3, marginRight: 5,}}
        {...{scrollY, inputRange}}
      >
        <SvgIcon
          name={SVG_KEYS.DuplicateFilled}
          size={30}
          fill={'white'}
        />
        <SvgIcon
          name={SVG_KEYS.DuplicateOutlined}
          size={30}
          stroke={'white'}
        />
      </LargeTitleFadeIcon>
    );
  };

  //todo - active
  _renderItem = ({item: section, index}) => {
    return (
      <CreateQuizListItem
        onPressSectionItem={this._handleOnPressSectionItem}
        {...{section, index}}
      />
    );
  };

  render() {
    const { styles } = CreateQuizScreen;
    const { scrollEnabled, ...state } = this.state;

    const sections  = state[QuizKeys.quizSections] ?? [];
    const itemCount = state[QuizKeys.quizSectionCount];

    return (
      <View style={styles.rootContainer}>
        <LargeTitleWithSnap
          ref={r => this.largeTitleRef = r}
          titleText={'Create Quiz'}
          subtitleText={"Create a new quiz reviewer"}
          showSubtitle={true}
          itemSize={200}
          //render handlers
          renderHeader={this._renderListHeader}
          renderFooter={this._renderListFooter}
          renderTitleIcon={this._renderTitleIcon}
          {...{itemCount}}
        >
          <REASectionList
            ref={r => this.sectionList = r}
            sections={[{ data: sections }]}
            keyExtractor={this._handleKeyExtractor}
            renderItem={this._renderItem}
            contentOffset={{y: -100}}
            {...{scrollEnabled}}
          />
        </LargeTitleWithSnap>
        <ScreenFooter ref={r => this.footerRef = r}>
          <ButtonGradient
            containerStyle={styles.headerButton}
            title={'Finish Quiz'}
            subtitle={'Create and save the current quiz'}
            onPress={this._handleOnPressDone}
            gradientColors={[Colors.INDIGO.A400, Colors.BLUE.A700]}
            iconDistance={15}
            isBgGradient={true}
            showChevron={true}
            showIcon={true}
            leftIcon={(
              <Ionicon
                name={'ios-checkmark-circle'}
                color={'white'}
                size={27}
              />
            )}
          />
        </ScreenFooter>
      </View>
    );
  };
  //#endregion
};