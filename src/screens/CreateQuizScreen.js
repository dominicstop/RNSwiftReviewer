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
import { CreateQuizListFooter } from 'app/src/components/CreateQuizListFooter';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { RNN_ROUTES, ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz, MNPQuizAddSection } from 'app/src/constants/NavParams';
import { QuizKeys, QuizSectionKeys } from 'app/src/constants/PropKeys';

import { QuizModel        } from 'app/src/models/QuizModel';
import { QuizSectionModel } from 'app/src/models/QuizSectionModel';

import { ModalController } from 'app/src/functions/ModalController';


export class CreateQuizScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    divider: {
      marginTop: 15,
      marginHorizontal: 15,
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

    this.quiz.setDateCreated();
    this.quiz.setQuizID();

    this.state = {
      scrollEnabled: true,
      isAsc: false,
      sortIndex: 0,
      // pass down def. values from quizes
      ...this.quiz.values,
    };
  };

  // #region - event handlers / callbacks
  _handleKeyExtractor = (section, index) => {
    return section[QuizSectionKeys.sectionID];
  };

  _handleOnQuizEditModalClose = ({title, desc}) => {
    this.setState({
      quizTitle: title,
      quizDesc : desc,
    });
  };

  _handleOnAddSectionPressDone = ({title, desc, sectionType}) => {
    this.footerRef.setVisibilty(true);

    const section = new QuizSectionModel();

    section.title = title;
    section.desc  = desc;
    section.type  = sectionType;

    section.setDateCreated();
    section.setSectionID();

    this.quiz.addSection(section.values);
    this.setState({ ...this.quiz.values });
  };

  _handleOnPressEditQuiz = () => {
    const { navigation } = this.props;

    // get quiz title/desc from state
    const quizTitle = this.state[QuizKeys.quizTitle];
    const quizDesc  = this.state[QuizKeys.quizDesc ];
    
    // open CreateQuizModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalCreateQuiz,
      navProps: {
        [MNPCreateQuiz.navigation]: navigation,
        [MNPCreateQuiz.isEditing ]: true     ,
        [MNPCreateQuiz.quizTitle ]: quizTitle,
        [MNPCreateQuiz.quizDesc  ]: quizDesc ,
        //modal: attach onPress done/save event
        [MNPCreateQuiz.onPressDone]: this._handleOnQuizEditModalClose,
      },
    });
  };

  _handleOnPressAddSection = () => {
    const { navigation } = this.props;

    // open QuizAddSectionModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizAddSection,
      navProps: {
        [MNPQuizAddSection.navigation  ]: navigation,
        [MNPQuizAddSection.isEditing   ]: false,
        [MNPQuizAddSection.sectionTitle]: null ,
        [MNPQuizAddSection.sectionDesc ]: null ,
        [MNPQuizAddSection.sectionType ]: null ,
        //modal: attach onPress done/save event
        [MNPCreateQuiz.onPressDone]: this._handleOnAddSectionPressDone,
      },
    });
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
    const state = this.state;

    // get quiz title/desc from state
    const quizTitle = state[QuizKeys.quizTitle] ?? 'Title N/A';
    const quizDesc  = state[QuizKeys.quizDesc ] ?? 'No Description to show.';

    // get section item count
    const sections       = state[QuizKeys.quizSections];
    const countSection   = sections?.length ?? 0;
    const countQuestions = 0;

    return(
      <CreateQuizListHeader
        onPressEditQuiz={this._handleOnPressEditQuiz}
        onPressAddSection={this._handleOnPressAddSection}
        // pass down as props
        {...{quizTitle, quizDesc, countSection, countQuestions}}
        // pass down LargeTitleWithSnap params
        {...{scrollY, inputRange}}
      />
    );
  };

  // section list footer card
  _renderListFooter = () => {
    const state = this.state;

    // get section item count
    const sections  = state[QuizKeys.quizSections];
    const itemCount = sections?.length ?? 0;

    if(itemCount == 0) return;

    return(
      <CreateQuizListFooter
        onPressAddSection={this._handleOnPressAddSection}
      />
    );
  };
  
  // receives params from LargeTitleWithSnap comp
  // section list header card
  _renderTitleIcon = ({scrollY, inputRange}) => {
    return(
      <LargeTitleFadeIcon 
        style={{marginTop: 0, marginRight: 3}}
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
        {...{index, ...section}}
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
          itemSize={100}
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