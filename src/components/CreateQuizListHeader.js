import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import   Ionicon    from '@expo/vector-icons/Ionicons';
import { iOSUIKit } from 'react-native-typography';

import { Divider  } from "react-native-elements";

import { LargeTitleHeaderCard } from 'app/src/components/LargeTitleHeaderCard';
import { ListCardEmpty        } from 'app/src/components/ListCardEmpty';
import { ButtonGradient       } from 'app/src/components/ButtonGradient';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';


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

export class CreateQuizListHeader extends React.Component {
  static propTypes = {
    onPressEditQuiz  : PropTypes.func,
    onPressAddSection: PropTypes.func,
  };

  static styles = StyleSheet.create({
    divider: {
      marginTop: 15,
      marginHorizontal: 15,
    },
    headerButton: {
      marginTop: 10,
      marginBottom: 5,
    },
  });

  render(){
    const { styles } = CreateQuizListHeader;
    const props = this.props;

    const EmptyCard = (
      <ListCardEmpty
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
          onPress={props.onPressAddSection}
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
    );

    return(
      <Fragment>
        <LargeTitleHeaderCard
          imageSource={require('app/assets/icons/lbw-book-tent.png')}
          isTitleAnimated={true}
          addShadow={true}
          textTitle={'Create A New Quiz'}
          textBody={TextConstants.HeaderBody}
          scrollY={props.scrollY}
          inputRange={props.inputRange}
        >
          <Divider style={styles.divider}/>
          <QuizDetails
            quizTitle={props.quizTitle}
            quizDesc ={props.quizDesc }
          />
          <ButtonGradient
            containerStyle={styles.headerButton}
            title={'Edit Quiz Details'}
            subtitle={'Modify the quiz title and description'}
            onPress={props.onPressEditQuiz}
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
        {(props.itemCount == 0) && EmptyCard}
      </Fragment>
    );
  };
};