import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import Reanimated from "react-native-reanimated";
import Ionicon    from '@expo/vector-icons/Ionicons';

import { Divider  } from "react-native-elements";
import { iOSUIKit } from 'react-native-typography';

import { LargeTitleWithSnap   } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon   } from 'app/src/components/LargeTitleFadeIcon';
import { LargeTitleHeaderCard } from 'app/src/components/LargeTitleHeaderCard';
import { ListSectionHeader    } from 'app/src/components/ListSectionHeader';
import { QuizListItem         } from 'app/src/components/QuizListItem';
import { ButtonGradient       } from 'app/src/components/ButtonGradient';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { SortValuesQuiz, SortKeysQuiz } from 'app/src/constants/SortValues';
import { HeaderValues } from 'app/src/constants/HeaderValues';
import { TestDataQuiz } from 'app/src/constants/TestData';
import { GREY } from 'app/src/constants/Colors';
import { RNN_ROUTES } from 'app/src/constants/Routes';

import { QuizKeys } from 'app/src/models/QuizModel';

import { ModalController } from 'app/src/functions/ModalController';
import { sortQuizItems } from 'app/src/functions/SortItems';
import { setStateAsync, timeout } from 'app/src/functions/helpers';


//create reanimated comps
const RNSectionList = Reanimated.createAnimatedComponent(SectionList);


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
    title: 'Quiz'
  };

  constructor(props){
    super(props);

    const testData = Object.values(TestDataQuiz);

    this.state = {
      scrollEnabled: true,
      isAsc: false,
      sortIndex: 0,
      quizes: testData,
    };
  };

  componentDidMount = async () => {
    await timeout(100);
    const node = this.sectionList.getNode();
    node && node.scrollToLocation({
      itemIndex: 0,
      sectionIndex: 0,
      viewPosition: 0,
      animated: false,
    });
  };

  _handleOnPressCreateQuiz = () => {
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalCreateQuiz,
    });
  };

  //#region - event handlers / callbacks
  _handleKeyExtractor = (quiz, index) => {
    return quiz[QuizKeys.quizID];
  };

  _handleOnPressQuizItem = ({quiz, index}) => {
    ModalController.showModal();
  };

  // sort pill pressed - cycle through sort options
  _handleOnPressSort = async (nextIsAsc, nextSortIndex) => {
    const { quizes } = this.state;
    const transitionRef = this.largeTitleRef.getTransitionRef();

    const sortType = Object.keys(SortKeysQuiz)[nextSortIndex];
    const nextQuizes = sortQuizItems(quizes, sortType, nextIsAsc);

    await setStateAsync(this, { 
      isAsc: nextIsAsc, 
      sortIndex: nextSortIndex,
      scrollEnabled: false
    });

    transitionRef.animateNextTransition();
    await setStateAsync(this, {
      quizes: nextQuizes,
    });

    await timeout(300);
    await setStateAsync(this, { 
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
      viewOffset: headerHeight,
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

    const sortType = Object.keys(SortKeysQuiz)[nextSortIndex];
    const nextQuizes = sortQuizItems(quizes, sortType, nextIsAsc);

    transitionRef.animateNextTransition();
    await setStateAsync(this, { 
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
      <ListSectionHeader
        sortTypes={SortKeysQuiz}
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

    return (
      <View style={styles.rootContainer}>
        <LargeTitleWithSnap
          ref={r => this.largeTitleRef = r}
          titleText={'Quizes'}
          subtitleText={'Your Quiz Reviewers'}
          showSubtitle={true}
          //render handlers
          renderHeader={this._renderListHeader}
          renderTitleIcon={this._renderTitleIcon}
        >
          <RNSectionList
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

