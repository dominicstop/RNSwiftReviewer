import React, { Fragment } from 'react';
import { StyleSheet, Text, View, SectionList, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import Ionicon from '@expo/vector-icons/Ionicons';

import { Divider  } from "react-native-elements";
import { iOSUIKit } from 'react-native-typography';

import { LargeTitleWithSnap   } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon   } from 'app/src/components/LargeTitleFadeIcon';
import { LargeTitleHeaderCard } from 'app/src/components/LargeTitleHeaderCard';
import { ListSectionHeader    } from 'app/src/components/ListSectionHeader';
import { ListCardEmpty        } from 'app/src/components/ListCardEmpty';
import { QuizListItem         } from 'app/src/components/QuizListItem';
import { ButtonGradient       } from 'app/src/components/ButtonGradient';
import { REASectionList       } from 'app/src/components/ReanimatedComps';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { SortValuesQuiz, SortTypesQuiz } from 'app/src/constants/SortValues';
import { GREY } from 'app/src/constants/Colors';

import { HeaderValues } from 'app/src/constants/HeaderValues';
import { TestDataQuiz } from 'app/src/constants/TestData';
import { INSET_TOP    } from 'app/src/constants/UIValues';
import { RNN_ROUTES   } from 'app/src/constants/Routes';

import { QuizKeys } from 'app/src/models/QuizModel';

import * as Helpers           from 'app/src/functions/helpers';
import    { ModalController } from 'app/src/functions/ModalController';
import    { sortQuizItems   } from 'app/src/functions/SortItems';


export class QuizListScreen extends React.Component {
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
    title: 'Quiz',
  };

  constructor(props){
    super(props);

    const testData = Object.values(TestDataQuiz);

    this.state = {
      scrollEnabled: true,
      isAsc: false,
      sortIndex: 0,
      //quizes: [],
      //quizes: [testData[0]],
      //quizes: [testData[0], testData[1]],
      //quizes: [testData[0], testData[1], testData[2]],
      quizes: testData,
    };
  };

  _handleOnPressCreateQuiz = () => {
    const { navigation } = this.props;

    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalCreateQuiz,
      navProps: {
        navigation
      },
    });
  };

  //#region - event handlers / callbacks
  _handleKeyExtractor = (quiz, index) => {
    return quiz[QuizKeys.quizID];
  };

  _handleOnPressQuizItem = ({quiz, index}) => {
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalViewQuiz
    });
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

    return(
      <LargeTitleHeaderCard
        imageSource={require('app/assets/icons/circle_paper_pencil.png')}
        isTitleAnimated={true}
        textTitle={'Your Quizes'}
        {...{scrollY, inputRange}}
      >
        <Divider style={styles.divider}/>
        <ButtonGradient
          containerStyle={styles.headerButton}
          title={'Create Quiz'}
          subtitle={'Create a new quiz item'}
          onPress={this._handleOnPressCreateQuiz}
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
    );
  };

  // item count + sort buttons
  _renderSectionHeader = ({ section }) => {
    const { quizes, sortIndex, isAsc: isAscending } = this.state;
    const itemCount = quizes.length ?? 0;

    return(
      <Fragment>
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

