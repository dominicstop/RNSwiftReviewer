import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { RNN_ROUTES, ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz } from 'app/src/constants/NavParams';

import { ModalController } from 'app/src/functions/ModalController';


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

    const quizTitle = params[SNPCreateQuiz.quizTitle];
    const quizDesc  = params[SNPCreateQuiz.quizDesc ];

    this.state = {
      quizTitle, quizDesc,
      scrollEnabled: true,
      isAsc: false,
      sortIndex: 0,
    };
  };

  _handleOnEditModalClose = ({title, desc}) => {
    this.setState({
      quizTitle: title,
      quizDesc : desc,
    });
  };

  _handleOnPressEditQuiz = () => {
    const { navigation } = this.props;
    const { quizTitle, quizDesc } = this.state;
    
    ModalController.showModal({
      routeName: RNN_ROUTES.RNNModalCreateQuiz,
      navProps: {
        [MNPCreateQuiz.navigation]: navigation,
        [MNPCreateQuiz.isEditing ]: true     ,
        [MNPCreateQuiz.quizTitle ]: quizTitle,
        [MNPCreateQuiz.quizDesc  ]: quizDesc ,
        //modal close event
        [MNPCreateQuiz.onModalClose]: this._handleOnEditModalClose,
      },
    });
  };

  //todo
  //#region - event handlers / callbacks
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

  //todo - active
  //#region - render functions
  // receives params from LargeTitleWithSnap comp
  _renderListHeader = ({scrollY, inputRange}) => {
    const { styles } = CreateQuizScreen;
    const { quizTitle, quizDesc } = this.state;

    const textBody = Helpers.sizeSelectSimple({
      normal: 'Quizes are a collection of sections, which in turn, holds related questions together.',
      large : 'Quizes are a collection of different sections, which in turn, holds several related questions that are grouped together.',
    });

    return(
      <LargeTitleHeaderCard
        imageSource={require('app/assets/icons/lbw-book-tent.png')}
        isTitleAnimated={true}
        addShadow={true}
        textTitle={'Create A New Quiz'}
        {...{scrollY, inputRange, textBody}}
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
          showChevron={true}
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
    );
  };

  //todo
  // item count + sort buttons
  _renderSectionHeader = ({ section }) => {
    //const { quizes, sortIndex, isAsc: isAscending } = this.state;

    return;

    return(
      <Fragment>

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

    const { navigation } = this.props;
    const { params } = navigation.state;

    const quizTitle = params[SNPCreateQuiz.quizTitle];

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
            renderSectionHeader={this._renderSectionHeader}
            keyExtractor={this._handleKeyExtractor}
            renderItem={this._renderItem}
            contentOffset={{y: -100}}
            {...{scrollEnabled}}
          />
        </LargeTitleWithSnap>
      </View>
    );
  };
  //#endregion
};