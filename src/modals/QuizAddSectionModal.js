import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Keyboard, Animated, Image } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Ionicon from '@expo/vector-icons/Ionicons';

import { Divider    } from 'react-native-elements';
import { iOSUIKit   } from 'react-native-typography';
import { Navigation } from 'react-native-navigation';

import { ModalBackground   } from 'app/src/components/ModalBackground';
import { ModalHeader       } from 'app/src/components/ModalHeader';
import { ModalFooter       } from 'app/src/components/ModalFooter';
import { ModalFooterButton } from 'app/src/components/ModalFooterButton';
import { ModalOverlayCheck } from 'app/src/components/ModalOverlayCheck';
import { ModalSection      } from 'app/src/components/ModalSection';
import { ModalInputField   } from 'app/src/components/ModalInputField';
import { ListFooterIcon    } from 'app/src/components/ListFooterIcon';
import { ListItemBadge     } from 'app/src/components/ListItemBadge';

import { RadioList, RadioListKeys } from 'app/src/components/RadioList';

import { ROUTES, RNN_ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz } from 'app/src/constants/NavParams';
import { SectionTypes, SectionTypesRadioValuesMap } from 'app/src/constants/SectionTypes';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Colors   from 'app/src/constants/Colors';
import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';


class QuizSectionHeader extends React.Component {
  static styles = StyleSheet.create({
    rootContainer: {
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    imageTextContainer: {
      flexDirection: 'row',
      marginTop: 12,
      justifyContent: 'center',
    },
    leftImage: {
      aspectRatio: 1,
      width: Helpers.sizeSelectSimple({
        normal: 75,
        large : 85,
      }),
    },
    textTitle: {
      ...iOSUIKit.bodyObject,
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 7,
      textAlignVertical: 'center',
      marginBottom: 1,
    },
    textSubtitle: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[900],
      opacity: 0.7,
    },
    titleDescContainer: {
      flex: 1,
      marginLeft: 15,
      justifyContent: 'center',
    },
    textSectionTitle: {
      ...iOSUIKit.bodyEmphasizedObject,
    },
    textSectionDesc: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[800],
      maxWidth: 400,
    },
  });

  componentDidUpdate(prevProps){
    const { selectedType } = this.props;

    if(selectedType != prevProps.selectedType){
      this.rootContainerRef.pulse(300);
    };
  };

  render(){
    const { styles } = QuizSectionHeader;
    const { listItems, selectedType } = this.props;
    
    const selectedSection = listItems[selectedType];

    return(
      <View style={styles.rootContainer}>
        <View style={styles.titleContainer}>
          <ListItemBadge
            value={3}
            size={18}
            color={Colors.INDIGO.A400}
          />
          <Text style={styles.textTitle}>
            {'Section Type'}
          </Text>
        </View>
        <Text style={styles.textSubtitle}>
          {'Choose a section type from the list'}
        </Text>
        <Animatable.View 
          style={styles.imageTextContainer}
          ref={r => this.rootContainerRef = r}
          useNativeDriver={true}
        >
          <Animatable.Image
            style={styles.leftImage}
            source={require('app/assets/icons/lbw-usb.png')}
            animation={'pulse'}
            duration={6000}
            iterationCount={'infinite'}
            iterationDelay={1000}
            useNativeDriver={true}
          />
          <View style={styles.titleDescContainer}>
            <Text style={styles.textSectionTitle}>
              {selectedSection[RadioListKeys.title]}
            </Text>
            <Text style={styles.textSectionDesc}>
              {selectedSection[RadioListKeys.descLong]}
            </Text>
          </View>
        </Animatable.View>
      </View>
    );
  };
};

export class QuizAddSectionModal extends React.Component {
  static options() {
    return {
    };
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    headerContainer: {
      paddingVertical: 10,
    },
    divider: {
      marginTop: 12,
      marginHorizontal: 12,
    },
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.5)'
    },
    overlay: {
    },
  });

  constructor(props){
    super(props);

    this.progress = new Animated.Value(0);

    this._opacity = this.progress.interpolate({
      inputRange : [0, 0.25],
      outputRange: [0, 1  ],
    });
    
    this.state = {
      selectedSectionType: SectionTypes.IDENTIFICATION,
    };

    this.lottieSource = require('app/assets/lottie/check_done.json');
  };

  _handleOnPressSectionItem = ({type}) => {
    this.setState({
      selectedSectionType: type,
    });
  };

  _handleOnSubmitEditing = ({index}) => {
    if(index == 0){
      this.inputRefDesc.focus();

    } else if(index == 1){
      Keyboard.dismiss();
    };
  };

  _handleOnPressButtonLeft = async () => {
    const { componentId, ...props } = this.props;
    const { selectedSectionType } = this.state;


    const isEditing   = props[MNPCreateQuiz.isEditing  ];
    const onPressDone = props[MNPCreateQuiz.onPressDone];

    const isValidTitle    = this.inputFieldRefTitle.isValid(false);
    const isValidSubtitle = this.inputFieldRefDesc .isValid(false);

    if(isValidTitle && isValidSubtitle){
      const title = this.inputFieldRefTitle.getText();
      const desc  = this.inputFieldRefDesc .getText()

      await this.overlay.start();

      // trigger callback event
      onPressDone && onPressDone({
        title, desc,
        sectionType: selectedSectionType,
      });

      // close modal
      Navigation.dismissModal(componentId);

    } else {
      await Helpers.asyncAlert({
        title: 'Invalid Input',
        desc : 'Oops, please fill out the required forms to continue.'
      });

      //animate shake
      this.inputFieldRefTitle.isValid(true);
      this.inputFieldRefDesc .isValid(true);
    };
  };

  _handleOnPressButtonRight = async () => {
    const { componentId } = this.props;

    //close modal
    await Helpers.timeout(200);
    Navigation.dismissModal(componentId);
  };

  render(){
    const { styles } = QuizAddSectionModal;
    const props = this.props;
    const state = this.state;

    const isEditing = props[MNPCreateQuiz.isEditing];

    const overlayContainerStyle = {
      opacity: this._opacity,
    };

    const modalHeader = (
      <ModalHeader
        title={(isEditing
          ? 'Edit Section Details'
          : 'Add New Section'
        )}
        subtitle={(isEditing
          ? "Modify section title and description"
          : "Enter section details (title, description, etc.)"
        )}
        headerIcon={(
          <Ionicon
            name={'ios-albums'}
            size={22}
            color={'white'}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonLeftTitle={(isEditing? 'Save' : 'Done')}
          buttonLeftSubtitle={(isEditing
            ? 'Update section'
            : 'Create section'
          )}
          onPressButtonLeft={this._handleOnPressButtonLeft}
          onPressButtonRight={this._handleOnPressButtonRight}
        />
      </ModalFooter>
    );

    const overlay = (
      <ModalOverlayCheck
        ref={r => this.overlay = r}
      />
    );

    return (
      <ModalBackground
        {...{modalHeader, modalFooter, overlay}}
      >
        <ModalSection showBorderTop={false}>
          <ModalInputField
            index={0}
            ref={r => this.inputFieldRefTitle = r}
            inputRef={r => this.inputRefTitle = r}
            title={'Section Title'}
            subtitle={'Give this section a title (ex: Math Prelims etc.)'}
            placeholder={'Enter Section Title'}
            initialValue={props[MNPCreateQuiz.quizTitle]}
            onSubmitEditing={this._handleOnSubmitEditing}
            validate={Validate.isNotNullOrWhitespace}
            iconActive={(
              <SvgIcon
                name={SVG_KEYS.BookFilled}
                size={20}
              />
            )}
            iconInactive={(
              <SvgIcon
                name={SVG_KEYS.BookOutlined}
                size={20}
              />
            )}
          />
        </ModalSection>
        <ModalSection>
          <ModalInputField
            index={1}
            ref={r => this.inputFieldRefDesc = r}
            inputRef={r => this.inputRefDesc = r}
            title={'Description'}
            subtitle={'Give this section a short description.'}
            placeholder={'Enter Section Title'}
            initialValue={props[MNPCreateQuiz.quizDesc]}
            validate={Validate.isNotNullOrWhitespace}
            iconActive={(
              <SvgIcon
                name={SVG_KEYS.ReceiptsFilled}
                size={20}
              />
            )}
            iconInactive={(
              <SvgIcon
                name={SVG_KEYS.ReceiptsOutlined}
                size={20}
              />
            )}
          />
        </ModalSection>
        <ModalSection paddingBottom={0}>
          <QuizSectionHeader
            listItems={SectionTypesRadioValuesMap}
            selectedType={state.selectedSectionType}
          />
          <Divider style={styles.divider}/>
          <RadioList
            //containerStyle={}
            enumTypes={SectionTypes}
            selectedType={state.selectedSectionType}
            listItems={SectionTypesRadioValuesMap}
            onPressListItem={this._handleOnPressSectionItem}
          />
        </ModalSection>
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};