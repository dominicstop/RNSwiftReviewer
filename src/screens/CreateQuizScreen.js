import React, { Fragment } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';

import  Ionicon from 'react-native-vector-icons/Ionicons';
import { StackActions } from 'react-navigation';

import { LargeTitleWithSnap } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon } from 'app/src/components/LargeTitleFadeIcon';
import { ButtonGradient     } from 'app/src/components/ButtonGradient';
import { REASectionList     } from 'app/src/components/ReanimatedComps';
import { ScreenFooter       } from 'app/src/components/ScreenFooter';
import { ScreenOverlayCheck } from 'app/src/components/ScreenOverlayCheck';

import { CreateQuizListItem   } from 'app/src/components/CreateQuizScreen/CreateQuizListItem';
import { CreateQuizListHeader } from 'app/src/components/CreateQuizScreen/CreateQuizListHeader';
import { CreateQuizListFooter } from 'app/src/components/CreateQuizScreen/CreateQuizListFooter';

import { ModalView } from 'app/src/components_native/ModalView';

import { CreateQuizModal     } from 'app/src/modals/CreateQuizModal';
import { QuizAddSectionModal } from 'app/src/modals/QuizAddSectionModal';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { RNN_ROUTES, ROUTES } from 'app/src/constants/Routes';
import { QuizKeys, QuizSectionKeys } from 'app/src/constants/PropKeys';
import { SNPCreateQuiz, MNPCreateQuiz, MNPQuizAddSection, MNPQuizAddQuestion } from 'app/src/constants/NavParams';

import { QuizModel        } from 'app/src/models/QuizModel';
import { QuizSectionModel } from 'app/src/models/QuizSectionModel';

import { QuizStore } from 'app/src/functions/QuizStore';
import { QuizAddQuestionModal } from '../modals/QuizAddQuestionModal';


// TODO:
// [ ] - Move footerRef.setVisibility to componentDidUpdate
// [ ] - Change "Edit Quiz Details" color to secondary
// [ ] - implement section deleting
// [ ] - preview question/sections when creating


export class CreateQuizScreen extends React.Component {
  static navigationOptions = {
    title: 'Create Quiz',
    headerShown: true,
    headerTitle: () => null,
    headerBackground: () => null,
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    divider: {
      marginTop: 15,
      marginHorizontal: 15,
    },
  });

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
    // open CreateQuizModal
    this.modalViewCreateQuizRef.setVisibility(true);
  };

  // ScreenFooter - onPress "Finish Quiz"
  _handleOnPressFinishQuiz = async () => {
    const { navigation } = this.props;
    const quiz = this.quiz.values;

    const quizTitle     = quiz[QuizKeys.quizTitle];
    const questionCount = quiz[QuizKeys.quizQuestionCount];

    if(questionCount <= 0){
      Alert.alert(
        'Add a Question first',
        'Create a bunch of questions first before saving this quiz.'
      );

    } else {
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
        `"${quizTitle}" has been successfully saved.`
      );
    };
  };

  // onPress: Add New Section
  _handleOnPressAddSection = () => {
    // open QuizAddSectionModal
    this.modalViewAddSectionRef.setVisibility(true, {
      [MNPQuizAddSection.isEditing]: false,
      [MNPQuizAddSection.section  ]: {},
      //event: attach onPress done/save handler
      [MNPQuizAddSection.onPressDone]: this._handleAddSectionModalOnPressCreate,
    });
  };

  // CreateQuizListItem - edit
  _handleOnPressSectionEdit = ({section, index}) => {
    // open QuizAddSectionModal in isEditing mode
    this.modalViewAddSectionRef.setVisibility(true, {
      [MNPQuizAddSection.section  ]: section,
      [MNPQuizAddSection.isEditing]: true,
      //event: attach onPress done/save handler
      [MNPQuizAddSection.onPressDone  ]: this._handleAddSectionModalOnPressEdit,
      [MNPQuizAddSection.onPressDelete]: this._handleAddSectionModalOnPressDelete,
    });
  };

  // CreateQuizListItem - add question
  _handleOnPressSectionAdd = ({section, index}) => {
    // open QuizAddQuestionModal
    this.modalViewAddQuestionRef.setVisibility(true, {
      [MNPQuizAddQuestion.quizSection ]: section,
      [MNPQuizAddQuestion.onPressDone ]: this._handleQuizAddQuestionModalOnPressDone,
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
    this.footerRef.setVisibility(true);

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
    try {
      const section = new QuizSectionModel();
      
      //set values
      section.title     = title;
      section.desc      = desc;
      section.type      = sectionType;
      section.sectionID = sectionID;

      // update section, excluding questions
      this.quiz.updateSection(section.values, false);
      this.setState({
        ...this.quiz.values,
      });

    } catch(error){
      console.log('_handleAddSectionModalOnPressEdit - error');
      console.log(error);

      setTimeout(() => {
        Alert.alert(
          'Error',
          'Could not update section',
        );
      }, 500);
    };
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
  _renderModal(){
    // get quiz title/desc from state
    const quizTitle = this.state[QuizKeys.quizTitle];
    const quizDesc  = this.state[QuizKeys.quizDesc ];

    return(
      <Fragment>
        <ModalView
          ref={r => this.modalViewCreateQuizRef = r}
          setModalInPresentationFromProps={true}
        >
          <CreateQuizModal {...{
            [MNPCreateQuiz.navigation]: null     ,
            [MNPCreateQuiz.isEditing ]: true     ,
            [MNPCreateQuiz.quizTitle ]: quizTitle,
            [MNPCreateQuiz.quizDesc  ]: quizDesc ,
            //modal: attach onPress done/save event
            [MNPCreateQuiz.onPressDone]: this._handleCreateQuizModalOnPressDone,
          }}/>
        </ModalView>
        <ModalView
          ref={r => this.modalViewAddSectionRef = r}
          setModalInPresentationFromProps={true}
        >
          <QuizAddSectionModal/>
        </ModalView>
        <ModalView
          ref={r => this.modalViewAddQuestionRef = r}
          setModalInPresentationFromProps={true}
        >
          <QuizAddQuestionModal/>
        </ModalView>
      </Fragment>
    );
  };

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
      <Fragment>
        {this._renderModal()}
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
      </Fragment>
    );
  };
  //#endregion
};