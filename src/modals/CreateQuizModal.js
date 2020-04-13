import React from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, Animated } from 'react-native';

import Ionicon from '@expo/vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { ModalBackground   } from 'app/src/components/ModalBackground';
import { ModalHeader       } from 'app/src/components/ModalHeader';
import { ModalFooter       } from 'app/src/components/ModalFooter';
import { ModalFooterButton } from 'app/src/components/ModalFooterButton';
import { ModalSection      } from 'app/src/components/ModalSection';
import { ModalOverlayCheck } from 'app/src/components/ModalOverlayCheck';
import { ModalInputField   } from 'app/src/components/ModalInputField';
import { ListFooterIcon    } from 'app/src/components/ListFooterIcon';

import { ROUTES, RNN_ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz } from 'app/src/constants/NavParams';

import { BLUE } from 'app/src/constants/Colors';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';

import { ModalController } from 'app/src/functions/ModalController';


export class CreateQuizModal extends React.PureComponent {
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
  });

  constructor(props){
    super(props);
  };

  // check if values were edited
  hasUnsavedChanges = () => {
    const props = this.props;

    const isEditing = props[MNPCreateQuiz.isEditing];
    const prevTitle = props[MNPCreateQuiz.quizTitle];
    const prevDesc  = props[MNPCreateQuiz.quizDesc ];

    const nextTitle = this.inputFieldRefTitle.getText();
    const nextDesc  = this.inputFieldRefDesc .getText();

    return (isEditing? (
      (prevTitle != nextTitle) ||
      (prevDesc  != nextDesc )
    ):(
      (nextTitle != '') ||
      (nextDesc  != '')
    ));
  };

  _handleOnSubmitEditing = ({index}) => {
    if(index == 0){
      this.inputRefDesc.focus();

    } else if(index == 1){
      Keyboard.dismiss();
    };
  };

  // modalFooter: confirm onPress
  _handleOnPressButtonLeft = async () => {
    const { navigation, componentId, ...props } = this.props;
    const hasChanges = this.hasUnsavedChanges();

    const isEditing   = props[MNPCreateQuiz.isEditing  ];
    const onPressDone = props[MNPCreateQuiz.onPressDone];

    const isValidTitle    = this.inputFieldRefTitle.isValid(false);
    const isValidSubtitle = this.inputFieldRefDesc .isValid(false);

    if(!hasChanges && isEditing){
      //no changes, close modal
      Navigation.dismissModal(componentId);

    } else if (isValidTitle && isValidSubtitle){
      const title = this.inputFieldRefTitle.getText();
      const desc  = this.inputFieldRefDesc .getText()

      !isEditing && navigation.navigate(ROUTES.createQuizRoute, {
        // pass as nav params to CreateQuizScreen
        [SNPCreateQuiz.quizTitle]: title,
        [SNPCreateQuiz.quizDesc ]: desc,
      });

      await this.overlay.start();

      // trigger event callback
      onPressDone && onPressDone({title, desc});

      //close modal
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
  
  // modalFooter: cancel onPress
  _handleOnPressButtonRight = async () => {
    const { componentId, ...props } = this.props;
    const didChange = this.hasUnsavedChanges();

    await Helpers.timeout(200);

    if(didChange){
      const shouldDiscard = await Helpers.asyncActionSheetConfirm({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard all of your changes?',
        confirmText: 'Discard',
        isDestructive: true,
      });

      // early exit if cancel, otherwise close modal
      if(!shouldDiscard) return;
    };

    //close modal
    Navigation.dismissModal(componentId);
  };

  render(){
    const { styles } = CreateQuizModal;
    const props = this.props;


    const isEditing = props[MNPCreateQuiz.isEditing];

    const modalHeader = (
      <ModalHeader
        title={(isEditing
          ? 'Edit Quiz Details'
          : 'Create New Quiz'
        )}
        subtitle={(isEditing
          ? "Modify quiz title and description"
          : "Enter the quiz title and description"
        )}
        headerIcon={(
          <Ionicon
            style={{marginLeft: 3, marginBottom: 1}}
            name={'ios-create'}
            size={24}
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
            ? 'Update quiz details'
            : 'Create new quiz'
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
            title={'Quiz Title'}
            subtitle={'Give this quiz a title (ex: Math Prelims etc.)'}
            placeholder={'Enter Quiz Title'}
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
        <ModalSection showBorderTop={true}>
          <ModalInputField
            index={1}
            ref={r => this.inputFieldRefDesc = r}
            inputRef={r => this.inputRefDesc = r}
            title={'Description'}
            subtitle={'Give this quiz a short description.'}
            placeholder={'Enter Quiz Title'}
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
        <ListFooterIcon
          show={true}
          marginTop={0}
        />
      </ModalBackground>
    );
  };
};
