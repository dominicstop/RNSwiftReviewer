import React from 'react';
import { StyleSheet, Text, View, SectionList, Image } from 'react-native';
import PropTypes from 'prop-types';

import { ROUTES } from 'app/src/constants/Routes';
import { ModalController } from 'app/src/functions/ModalController';

import Reanimated from "react-native-reanimated";
import { iOSUIKit } from 'react-native-typography';

import { LargeTitleWithSnap   } from 'app/src/components/LargeTitleFlatList';
import { LargeTitleFadeIcon   } from 'app/src/components/LargeTitleFadeIcon';
import { LargeTitleHeaderCard } from 'app/src/components/LargeTitleHeaderCard';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import { GREY } from 'app/src/constants/Colors';


//create reanimated comps
const RNSectionList = Reanimated.createAnimatedComponent(SectionList);

class ListSectionHeader extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  static styles = StyleSheet.create({
    rootContainer: {
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 10,
      //borders
      borderTopColor: GREY[400],
      borderTopWidth: 1,
      //shadows
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      shadowOffset: {
        width: 0,
        height: 5,
      },
    },
    textTitle: {
      ...iOSUIKit.subheadObject,
    },
    textCount: {
      ...iOSUIKit.subheadEmphasizedObject,
    },
  });

  render(){
    const { styles } = ListSectionHeader;

    return(
      <View style={styles.rootContainer}>
        <Text style={styles.textTitle}>
          {'Showing '}
          <Text style={styles.textCount}>
            {'12 items'}
          </Text>
        </Text>
      </View>
    );
  };
};



export class QuizListScreen extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'blue',
    },
    headerContainer: {
      position: 'absolute',
      backgroundColor: 'red',
      width: '100%',
      height: 100,
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

    this.state = {
      quizes: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
      ],
    };
  };

  _handleOnPressNavigate = () => {
    ModalController.showModal();
  };

  _renderListHeader = () => {
    return(
      <LargeTitleHeaderCard 
        imageSource={require('app/assets/icons/circle_paper_pencil.png')}
      />
    );
  };

  _renderSectionHeader = ({ section }) => {
    const { sections } = this.props;
    return(
      <ListSectionHeader/>
    );
  };

  //receives params from LargeTitleWithSnap comp
  _renderTitleIcon = ({scrollY, inputRange}) => {

    const activeIconStyle = {
      opacity: Reanimated.interpolate(scrollY, {inputRange,
        outputRange: [0, 1],
      }),
    };

    return(
      <LargeTitleFadeIcon 
        style={{marginTop: 2}}
        {...{scrollY, inputRange}}
      >
        <SvgIcon
          name={SVG_KEYS.BookFilled}
          size={30}
          color={'black'}
        />
        <SvgIcon
          name={SVG_KEYS.BookOutlined}
          size={30}
          color={'black'}
        />
      </LargeTitleFadeIcon>
    );
  };

  render() {
    const { styles } = QuizListScreen;
    const { quizes } = this.state;

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
            sections={[{ data: quizes }]}
            renderSectionHeader={this._renderSectionHeader}
            renderItem={({item}) => (
              <View style={{backgroundColor: 'red'}}>
                <Text>{item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => item + index}
          />
        </LargeTitleWithSnap>
      </View>
    );
  };
};

