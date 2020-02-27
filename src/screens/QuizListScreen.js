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

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { SortValuesQuiz, SortKeysQuiz } from 'app/src/constants/SortValues';
import { GREY } from 'app/src/constants/Colors';

import { ModalController } from 'app/src/functions/ModalController';
import { setStateAsync, timeout } from 'app/src/functions/helpers';
import { ButtonGradient } from '../components/ButtonGradient';
import { HeaderValues } from '../constants/HeaderValues';
import { TestDataQuiz } from '../constants/TestData';


//create reanimated comps
const RNSectionList = Reanimated.createAnimatedComponent(SectionList);


export class QuizListScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    headerContainer: {
      position: 'absolute',
      backgroundColor: 'red',
      width: '100%',
      height: 100,
    },
    divider: {
      marginTop: 15,
      marginHorizontal: 15,
    },
    headerButton: {
      marginTop: 10,
      marginBottom: 10
    },
    scrollview: {
      flex: 1,
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

  _handleOnPressNavigate = () => {
    ModalController.showModal();
  };

  //#region - event handlers / callbacks
  // sort pill pressed - cycle through sort options
  _handleOnPressSort = async (isAsc, sortIndex) => {
    await setStateAsync(this, { 
      isAsc, sortIndex,
      scrollEnabled: false
    });

    const node = this.sectionList.getNode();
    node && node.scrollToLocation({
      itemIndex: 0,
      sectionIndex: 0,
      viewPosition: 0,
      viewOffset: 0,
      animated: true,
    });

    await timeout(500);
    
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
  _handleOnPressSortOption = () => {
    this.setState({ scrollEnabled: true });
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
          onPress={this._handleOnPressButton}
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
    const { sortIndex, isAsc: isAscending } = this.state;
    return(
      <ListSectionHeader
        sortTypes={SortKeysQuiz}
        sortValues={SortValuesQuiz}
        {...{sortIndex, isAscending}}
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

  _renderItem = ({item, index}) => {
    return (
      <QuizListItem/>
    );
  };

  render() {
    const { styles } = QuizListScreen;
    const { quizes, scrollEnabled } = this.state;

    return (
      <View style={styles.rootContainer}>
        <LargeTitleWithSnap
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
            keyExtractor={(item, index) => item + index}
            renderItem={this._renderItem}
            {...{scrollEnabled}}
          />
        </LargeTitleWithSnap>
      </View>
    );
  };
  //#endregion
};

