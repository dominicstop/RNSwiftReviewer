import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';

import { Divider  } from "react-native-elements";
import { iOSUIKit } from 'react-native-typography';


import { LargeTitleWithSnap   } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon   } from 'app/src/components/LargeTitleFadeIcon';
import { LargeTitleHeaderCard } from 'app/src/components/LargeTitleHeaderCard';
import { ListCardEmpty        } from 'app/src/components/ListCardEmpty';
import { ButtonGradient       } from 'app/src/components/ButtonGradient';
import { REASectionList       } from 'app/src/components/ReanimatedComps';
import { ScreenFooter         } from 'app/src/components/ScreenFooter';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { RNN_ROUTES, ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz } from 'app/src/constants/NavParams';

import { ModalController } from 'app/src/functions/ModalController';
import { QuizModel, QuizKeys } from '../models/QuizModel';


const TextConstants = {
  // LargeTitleHeaderCard textBody
  HeaderBody: Helpers.sizeSelectSimple({
    normal: 'Quizes are a collection of sections, which in turn, holds related questions together.',
    large : 'Quizes are a collection of different sections, which in turn, holds several related questions that are grouped together.',
  }),
  // ListCardEmpty subtitle
  EmptyText: Helpers.sizeSelectSimple({
    normal: "This place is looking a bit sparse. Add a new section to get things started!",
    large : "This place is looking a bit sparse, don't you think? Go and add a new section to get things started!",
  }),
};

class QuizDetails extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      marginTop: 12,
      marginHorizontal: 12,
    },
    detailsContainer: {
      flexDirection: 'row',
      marginVertical: 2,
    },
    columnLeftContainer: {
      flex: 1,
      marginRight: 5,
    },
    columnRightContainer: {
      flex: 1,
      marginLeft: 5,
    },
    rowContainer: {
      flexDirection: 'row',
    },
    textDetailLabel: {
      ...iOSUIKit.bodyEmphasizedObject,
      flex: 1,
      color: Colors.GREY[900]
    },
    textDetail: {
      ...iOSUIKit.bodyObject,
      color: Colors.GREY[800]
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textTitle: {
      ...iOSUIKit.bodyObject,
      marginLeft: 5,
      fontSize: 20,
      fontWeight: '800',
      color: Colors.BLUE['900'],
    },
    textLabel: {
      ...iOSUIKit.bodyEmphasizedObject,
      fontWeight: '600',
      color: Colors.GREY[900],
    },
    textBody: {
      ...iOSUIKit.bodyObject,
      color: Colors.GREY[800],
    },
  });

  render(){
    const { styles } = QuizDetails;
    const props = this.props;

    const StatsComp = (
      <View style={styles.detailsContainer}>
        <View style={styles.columnLeftContainer}>
          <View style={styles.rowContainer}>
            <Text 
              style={styles.textDetailLabel}
              numberOfLines={1}
            >
              {'Sections'}
            </Text>
            <Text 
              style={styles.textDetail}
              numberOfLines={1}
            >
              {`0 Items`}
            </Text>
          </View>
        </View>
        <View style={styles.columnRightContainer}>
          <View style={styles.rowContainer}>
            <Text 
              style={styles.textDetailLabel}
              numberOfLines={1}
            >
              {'Questions'}
            </Text>
            <Text 
              style={styles.textDetail}
              numberOfLines={1}
            >
              {`0 Items`}
            </Text>
          </View>
        </View>
      </View>
    );

    return(
      <View style={styles.rootContainer}>
        <View style={styles.titleContainer}>
          <Ionicon
            style={{marginTop: 1}}
            name={'md-information-circle'}
            color={Colors.BLUE['A700']}
            size={22}
          />
          <Text style={styles.textTitle}>
            {props.quizTitle}
          </Text>
        </View>
        {StatsComp}
        <Text numberOfLines={3}>
          <Text style={styles.textLabel}>
            {'Quiz Description: '}
          </Text>
          <Text style={styles.textBody}>
            {props.quizDesc}
          </Text>
        </Text>
      </View>
    );
  };
};

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
  };

  //todo
  // #region - event handlers / callbacks
  _handleKeyExtractor = (quiz, index) => {
    return quiz[QuizKeys.quizID];
  };

  //todo
  _handleOnPressQuizItem = ({quiz, index}) => {
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalViewQuiz
    });
  };
  //#endregion

  // #region - render functions
  // receives params from LargeTitleWithSnap comp
  _renderListHeader = ({scrollY, inputRange}) => {
    const { styles } = CreateQuizScreen;
    
    // get quiz title/desc from state
    const quizTitle = this.state[QuizKeys.quizTitle] ?? 'Title N/A';
    const quizDesc  = this.state[QuizKeys.quizDesc ] ?? 'No Description to show.';
    
    // get section item count
    const sections  = this.state[QuizKeys.quizSections];
    const itemCount = sections?.length ?? 0;

    return(
      <Fragment>
        <LargeTitleHeaderCard
          imageSource={require('app/assets/icons/lbw-book-tent.png')}
          isTitleAnimated={true}
          addShadow={true}
          textTitle={'Create A New Quiz'}
          textBody={TextConstants.HeaderBody}
          {...{scrollY, inputRange}}
        >
          <Divider style={styles.divider}/>
          <QuizDetails
            {...{quizTitle, quizDesc}}
          />
          <ButtonGradient
            containerStyle={styles.headerButton}
            title={'Edit Quiz Details'}
            subtitle={'Modify the quiz title and description'}
            onPress={this._handleOnPressEditQuiz}
            iconType={'ionicon'}
            iconDistance={10}
            isBgGradient={true}
            showChevron={false}
            showIcon={true}
            leftIcon={(
              <Ionicon
                name={'ios-create'}
                color={'white'}
                size={27}
              />
            )}
          />
        </LargeTitleHeaderCard>
        {(itemCount == 0) && (
          <ListCardEmpty
            containerStyle={{ paddingBottom: 5 }}
            imageSource={require('app/assets/icons/e-pen-paper-stack.png')}
            title={"No sections to show"}
            subtitle={TextConstants.EmptyText}
          >
            <ButtonGradient
              containerStyle={styles.headerButton}
              bgColor={Colors.BLUE[100]}
              fgColor={Colors.BLUE[800]}
              alignment={'CENTER'}
              title={'Add New Section'}
              onPress={this._handleOnPressAddSection}
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
          </ListCardEmpty>
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

  //todo
  _renderItem = ({item: quiz, index}) => {
    return (
      null
    );
  };

  render() {
    const { styles } = CreateQuizScreen;
    const { scrollEnabled } = this.state;

    const itemCount = 0;
    const itemSize  = 200;

    return (
      <View style={styles.rootContainer}>
        <LargeTitleWithSnap
          ref={r => this.largeTitleRef = r}
          titleText={'Create Quiz'}
          subtitleText={"Create a new quiz reviewer"}
          showSubtitle={true}
          //render handlers
          renderHeader={this._renderListHeader}
          renderTitleIcon={this._renderTitleIcon}
          {...{itemCount, itemSize}}
        >
          <REASectionList
            ref={r => this.sectionList = r}
            sections={[{ data: [] }]}
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