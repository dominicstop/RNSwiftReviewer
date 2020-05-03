import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { LargeTitleWithSnap } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon } from 'app/src/components/LargeTitleFadeIcon';
import { ListSectionHeader  } from 'app/src/components/ListSectionHeader';
import { REASectionList     } from 'app/src/components/ReanimatedComps';

import { QuizListItem   } from 'app/src/components/QuizListScreen/QuizListItem';
import { QuizListHeader } from 'app/src/components/QuizListScreen/QuizListHeader';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { SortValuesQuiz, SortTypesQuiz } from 'app/src/constants/SortValues';

import { HeaderValues  } from 'app/src/constants/HeaderValues';
import { INSET_TOP     } from 'app/src/constants/UIValues';
import { RNN_ROUTES    } from 'app/src/constants/Routes';
import { MNPCreateQuiz, MNPViewQuiz } from 'app/src/constants/NavParams';

import { QuizKeys } from 'app/src/constants/PropKeys';

import * as Helpers from 'app/src/functions/helpers';

import { ModalController  } from 'app/src/functions/ModalController';
import { sortQuizItems    } from 'app/src/functions/SortItems';
import { QuizStore        } from 'app/src/functions/QuizStore';
import { QuizSessionStore } from '../functions/QuizSessionStore';


export class QuizListScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
  });

  static navigationOptions = {
    title: 'Quiz',
  };

  constructor(props){
    super(props);

    const cacheQuiz    = QuizStore       .getCache();
    const cacheSession = QuizSessionStore.getCache();

    // init cache index
    this.storeIndexQuiz    = cacheQuiz   .index;
    this.storeIndexSession = cacheSession.index;

    this.state = {
      sortIndex: 0,
      isAsc: false,
      loading: false,
      scrollEnabled: true,
      quizes: cacheQuiz.quizes,
      sessions: cacheSession.sessions,
    };
  };

  componentDidMount(){
    const { navigation } = this.props;

    this.focusListener = navigation.addListener(
      'didFocus', this.componentDidFocus
    );
  };

  componentWillUnmount() {
    this.focusListener.remove();
  };

  componentDidFocus = async () => {
    this.refresh();
  };

  refresh = async () => {
    const cacheQuiz    = QuizStore       .getCache();
    const cacheSession = QuizSessionStore.getCache();

    const refreshQuiz    = (cacheQuiz   .index != this.storeIndexQuiz   );
    const refreshSession = (cacheSession.index != this.storeIndexSession);

    if(refreshQuiz || refreshSession){
      if(refreshQuiz   ) this.storeIndexQuiz    = cacheQuiz   .index;
      if(refreshSession) this.storeIndexSession = cacheSession.index;

      await Helpers.setStateAsync(this, { 
        loading: true 
      });

      const resultQuiz    = refreshQuiz    && await QuizStore       .getQuizes  ();
      const resultSession = refreshSession && await QuizSessionStore.getSessions();

      await Helpers.setStateAsync(this, {
        loading: false,
        ...(refreshQuiz    && {quizes  : resultQuiz   .quizes  }),
        ...(refreshSession && {sessions: resultSession.sessions}),
      });
    };
  };

  //#region - event handlers / callbacks
  _handleKeyExtractor = (quiz, index) => {
    return quiz[QuizKeys.quizID];
  };

  _handleOnPressCreateQuiz = () => {
    const { navigation } = this.props;

    ModalController.showModal({
      routeName: RNN_ROUTES.ModalCreateQuiz,
      navProps: {
        [MNPCreateQuiz.navigation]: navigation,
        [MNPCreateQuiz.isEditing ]: false     ,
        [MNPCreateQuiz.quizTitle ]: null      ,
        [MNPCreateQuiz.quizDesc  ]: null      ,
      },
    });
  };

  // QuizListItem - onPress
  _handleOnPressQuizItem = ({quiz, index}) => {
    const { navigation } = this.props;
    const { sessions } = this.state;

    ModalController.showModal({
      routeName: RNN_ROUTES.ModalViewQuiz,
      navProps: {
        [MNPViewQuiz.quiz      ]: quiz      ,
        [MNPViewQuiz.sessions  ]: sessions  ,
        [MNPViewQuiz.navigation]: navigation,
        [MNPViewQuiz.onPressStartQuiz ]: this._handleOnPressStartQuiz ,
        [MNPViewQuiz.onPressDeleteQuiz]: this._handleOnPressDeleteQuiz,
      },
    });
  };

  // ViewQuizModal: onPress start
  _handleOnPressStartQuiz = () => {
  };

  // ViewQuizModal: onPress delete
  _handleOnPressDeleteQuiz = async (quiz) => {
    const quizID = quiz[QuizKeys.quizID];

    const result = await QuizStore.deleteQuizByID(quizID);
    if(result.success){
      await Helpers.setStateAsync(this, { 
        quizes: result.quizes 
      });
      // temp fix
      this.largeTitleRef.setExtraHeight();

    } else {
      await Helpers.asyncAlert({
        title: 'Error',
        desc : 'Unable to delete quiz.'
      });
    };
  };

  // sort pill pressed - cycle through sort options
  _handleOnPressSort = async (nextIsAsc, nextSortIndex) => {
    const { quizes } = this.state;
    const transitionRef = this.largeTitleRef.getTransitionRef();

    const sortType = Object.keys(SortTypesQuiz)[nextSortIndex];
    const nextQuizes = sortQuizItems(quizes, sortType, nextIsAsc);

    await Helpers.setStateAsync(this, { 
      isAsc: nextIsAsc, 
      sortIndex: nextSortIndex,
      scrollEnabled: false
    });

    transitionRef.animateNextTransition();
    await Helpers.setStateAsync(this, {
      quizes: nextQuizes,
    });

    await Helpers.timeout(300);
    await Helpers.setStateAsync(this, { 
      scrollEnabled: true
    });
  };

  // sort options expanded/shown
  _handleOnSortExpanded = () => {
    this.setState({ scrollEnabled: false });

    const headerHeight = HeaderValues.getHeaderHeight(true);
    const node = this.sectionList.getNode();

    node && node.scrollToLocation({
      itemIndex: 0,
      sectionIndex: 0,
      viewPosition: 0,
      viewOffset: headerHeight + INSET_TOP,
      animated: true,
    });
  };

  // sort options collapsed/hidden
  _handleOnPressCancel = () => {
    this.setState({ scrollEnabled: true });
  };

  // sort item has been selected from options
  _handleOnPressSortOption = async (nextIsAsc, nextSortIndex) => {
    const { quizes } = this.state;
    const transitionRef = this.largeTitleRef.getTransitionRef();

    const sortType = Object.keys(SortTypesQuiz)[nextSortIndex];
    const nextQuizes = sortQuizItems(quizes, sortType, nextIsAsc);

    transitionRef.animateNextTransition();
    await Helpers.setStateAsync(this, { 
      isAsc: nextIsAsc, 
      sortIndex: nextSortIndex,
      scrollEnabled: true,
      quizes: nextQuizes,
    });
  };
  //#endregion

  //#region - render functions
  // receives params from LargeTitleWithSnap comp
  _renderListHeader = ({scrollY, inputRange}) => {
    const { styles } = QuizListScreen;
    const { quizes } = this.state;

    const itemCount = quizes.length ?? 0;

    return(
      <QuizListHeader
        onPressCreateQuiz={this._handleOnPressCreateQuiz}
        {...{scrollY, inputRange, itemCount}}
      />
    );
  };

  // item count + sort buttons
  _renderSectionHeader = ({ section }) => {
    const { quizes, sortIndex, isAsc: isAscending } = this.state;
    const itemCount = quizes.length ?? 0;

    if(itemCount == 0) return;

    return(
      <ListSectionHeader
        sortTypes={SortTypesQuiz}
        sortValues={SortValuesQuiz}
        {...{sortIndex, isAscending, itemCount}}
        // event handlers
        onSortExpanded={this._handleOnSortExpanded}
        onPressSort={this._handleOnPressSort}
        onPressCancel={this._handleOnPressCancel}
        onPressSortOption={this._handleOnPressSortOption}
      />
    );
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
          name={SVG_KEYS.BookFilled}
          size={30}
          fill={'white'}
        />
        <SvgIcon
          name={SVG_KEYS.BookOutlined}
          size={30}
          stroke={'white'}
        />
      </LargeTitleFadeIcon>
    );
  };

  _renderItem = ({item: quiz, index}) => {
    return (
      <QuizListItem
        onPressQuizItem={this._handleOnPressQuizItem}
        {...{quiz, index}}
      />
    );
  };

  render() {
    const { styles } = QuizListScreen;
    const { quizes, scrollEnabled } = this.state;

    const itemCount = quizes.length;
    const itemSize  = 200;

    return (
      <View style={styles.rootContainer}>
        <LargeTitleWithSnap
          ref={r => this.largeTitleRef = r}
          titleText={'Quizzes'}
          subtitleText={'Your Quiz Reviewers'}
          showSubtitle={true}
          useTransition={true}
          //render handlers
          renderHeader={this._renderListHeader}
          renderTitleIcon={this._renderTitleIcon}
          {...{itemCount, itemSize}}
        >
          <REASectionList
            ref={r => this.sectionList = r}
            sections={[{ data: quizes }]}
            renderSectionHeader={this._renderSectionHeader}
            keyExtractor={this._handleKeyExtractor}
            renderItem={this._renderItem}
            {...{scrollEnabled}}
          />
        </LargeTitleWithSnap>
      </View>
    );
  };
  //#endregion
};

