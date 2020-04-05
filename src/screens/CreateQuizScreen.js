import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { StackActions } from 'react-navigation';

import { LargeTitleWithSnap   } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon   } from 'app/src/components/LargeTitleFadeIcon';
import { ButtonGradient       } from 'app/src/components/ButtonGradient';
import { REASectionList       } from 'app/src/components/ReanimatedComps';
import { ScreenFooter         } from 'app/src/components/ScreenFooter';
import { ScreenOverlayCheck   } from 'app/src/components/ScreenOverlayCheck';
import { CreateQuizListItem   } from 'app/src/components/CreateQuizListItem';
import { CreateQuizListHeader } from 'app/src/components/CreateQuizListHeader';
import { CreateQuizListFooter } from 'app/src/components/CreateQuizListFooter';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { RNN_ROUTES, ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz, MNPQuizAddSection, MNPQuizAddQuestion } from 'app/src/constants/NavParams';
import { QuizKeys, QuizSectionKeys } from 'app/src/constants/PropKeys';

import { QuizModel        } from 'app/src/models/QuizModel';
import { QuizSectionModel } from 'app/src/models/QuizSectionModel';

import { ModalController } from 'app/src/functions/ModalController';
import { QuizStore       } from 'app/src/functions/QuizStore';

// TODO:
// [ ] - Move footerRef.setVisibilty to componentDidUpdate
// [ ] - Change "Edit Quiz Details" color to secondary
// [ ] - implement section deleting
// [ ] - preview question/sections when creating


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

  _handleOnPressEditQuiz = ({section, index}) => {
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
        [MNPCreateQuiz.onPressDone]: this._handleCreateQuizModalOnPressDone,
      },
    });
  };

  // ScreenFooter - onPress "Finish Quiz"
  _handleOnPressFinishQuiz = async () => {
    const { navigation } = this.props;
    
    const quiz      = this.quiz.values;
    const quizTitle = quiz[QuizKeys.quizTitle];

    const confirm = await Helpers.asyncActionSheetConfirm({
      title: `Save ${quizTitle} Quiz`,
      message: "Are you done making quiz? If so, do you want to save it now?",
      confirmText: 'Save Quiz',
    });

    // cancel was selected
    if(!confirm) return;

    await Promise.all([
      // show check animation
      this.overlay.start(),
      // save quiz
      QuizStore.insertQuiz(quiz),
    ]);

    // pop back to home route
    navigation.dispatch(
      StackActions.popToTop()
    );

    await Helpers.timeout(500);
    Alert.alert(
      'Quiz Added',
      `${quizTitle} has been successfully saved.`
    ); 
  };

  // onPress: Add New Section
  _handleOnPressAddSection = () => {

    // open QuizAddSectionModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizAddSection,
      navProps: {
        [MNPQuizAddSection.isEditing   ]: false,
        [MNPQuizAddSection.sectionTitle]: null ,
        [MNPQuizAddSection.sectionDesc ]: null ,
        [MNPQuizAddSection.sectionType ]: null ,
        [MNPQuizAddSection.sectionID   ]: null ,
        //event: attach onPress done/save handler
        [MNPQuizAddSection.onPressDone]: this._handleAddSectionModalOnPressCreate,
      },
    });
  };

  // CreateQuizListItem - edit
  _handleOnPressSectionEdit = ({section, index}) => {

    const title = section[QuizSectionKeys.sectionTitle];
    const desc  = section[QuizSectionKeys.sectionDesc ];
    const type  = section[QuizSectionKeys.sectionType ];
    const id    = section[QuizSectionKeys.sectionID   ];

    // open QuizAddSectionModal
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizAddSection,
      navProps: {
        [MNPQuizAddSection.isEditing   ]: true,
        [MNPQuizAddSection.sectionTitle]: title,
        [MNPQuizAddSection.sectionDesc ]: desc ,
        [MNPQuizAddSection.sectionType ]: type ,
        [MNPQuizAddSection.sectionID   ]: id   ,
        //event: attach onPress done/save handler
        [MNPQuizAddSection.onPressDone  ]: this._handleAddSectionModalOnPressEdit,
        [MNPQuizAddSection.onPressDelete]: this._handleAddSectionModalOnPressDelete,
      },
    });
  
  };

  // CreateQuizListItem - add question
  _handleOnPressSectionAdd = ({section, index}) => {
    // open 
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalQuizAddQuestions,
      navProps: {
        [MNPQuizAddQuestion.quizSection ]: section,
        [MNPQuizAddQuestion.onPressDone ]: this._handleQuizAddQuestionModalOnPressDone,
      },
    });
  };

  // CreateQuizListItem - delete
  _handleOnPressSectionDelete = ({section, index}) => {
    this.quiz.deleteSection(section);
    this.setState({
      ...this.quiz.values
    });
  };
  //#endregion

  // #region - modal handlers / callbacks
  // modal callback: CreateQuizModal
  _handleCreateQuizModalOnPressDone = ({title, desc}) => {
    this.setState({
      quizTitle: title,
      quizDesc : desc,
    });
  };

  // modal callback: QuizAddSectionModal - create
  _handleAddSectionModalOnPressCreate = ({title, desc, sectionType}) => {
    this.footerRef.setVisibilty(true);

    const quizID = this.quiz.values[QuizKeys.quizID];
    const section = new QuizSectionModel();

    section.title  = title;
    section.desc   = desc;
    section.type   = sectionType;
    section.quizID = quizID;

    section.setDateCreated();
    section.setSectionID();

    this.quiz.addSection(section.values);
    this.setState({ ...this.quiz.values });
  };

  // modal callback: QuizAddSectionModal - edit
  _handleAddSectionModalOnPressEdit = ({title, desc, sectionType, sectionID}) => {
    const section = new QuizSectionModel();
    //set values
    section.title = title;
    section.desc  = desc;
    section.type  = sectionType;

    section.sectionID = sectionID;

    // update section, excluding questions
    this.quiz.updateSection(section.values, false);
    this.setState({
      ...this.quiz.values,
    });
  };

  _handleAddSectionModalOnPressDelete = (sectionID) => {
    this.quiz.deleteSectionByID(sectionID);
    this.setState({
      ...this.quiz.values
    });
  };

  // modal callback: QuizAddQuestionModal
  _handleQuizAddQuestionModalOnPressDone = ({section}) => {
    this.quiz.updateSection(section, true);

    this.setState({
      ...this.quiz.values,
    });
  };
  // #endregion

  // #region - render functions
  _renderListHeader = ({scrollY, inputRange}) => {
    const state = this.state;

    // get quiz title/desc from state
    const quizTitle = state[QuizKeys.quizTitle] ?? 'Title N/A';
    const quizDesc  = state[QuizKeys.quizDesc ] ?? 'No Description to show.';

    // get section item count
    const sections       = state[QuizKeys.quizSections];
    const countQuestions = state[QuizKeys.quizQuestionCount];
    const countSection   = sections?.length ?? 0;

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

  _renderItem = ({item: section, index}) => {
    return (
      <CreateQuizListItem
        onPressSectionEdit  ={this._handleOnPressSectionEdit  }
        onPressSectionAdd   ={this._handleOnPressSectionAdd   }
        onPressSectionDelete={this._handleOnPressSectionDelete}
        {...{index, section}}
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
            onPress={this._handleOnPressFinishQuiz}
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
        <ScreenOverlayCheck
          ref={r => this.overlay = r}
        />
      </View>
    );
  };
  //#endregion
};