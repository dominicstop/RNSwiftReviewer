import React from 'react';
import { StyleSheet, Keyboard } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';

import { ModalBody         } from 'app/src/components/Modal/ModalBody';
import { ModalHeader       } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter       } from 'app/src/components/Modal/ModalFooter';
import { ModalFooterButton } from 'app/src/components/Modal/ModalFooterButton';
import { ModalSection      } from 'app/src/components/Modal/ModalSection';
import { ModalInputField   } from 'app/src/components/Modal/ModalInputField';
import { ModalOverlayCheck } from 'app/src/components/Modal/ModalOverlayCheck';

import { ModalView } from 'app/src/components_native/ModalView';
import { ListFooterIcon } from 'app/src/components/ListFooterIcon';

import { ROUTES } from 'app/src/constants/Routes';
import { SNPCreateQuiz, MNPCreateQuiz } from 'app/src/constants/NavParams';

import   SvgIcon    from 'app/src/components/SvgIcon';
import { SVG_KEYS } from 'app/src/components/SvgIcons';

import * as Validate from 'app/src/functions/Validate';
import * as Helpers  from 'app/src/functions/helpers';


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

    const isEditing = props[MNPCreateQuiz.isEditing];
    const prevTitle = props[MNPCreateQuiz.quizTitle];
    const prevDesc  = props[MNPCreateQuiz.quizDesc ];

    this.textTitle = isEditing? prevTitle : '';
    this.textDesc  = isEditing? prevDesc  : '';
  };

  componentDidMount(){
    const { getModalRef } = this.props;
    if(getModalRef){
      // ModalView: receive modal ref
      this.modalRef = getModalRef();
    };
  };

  // check if values were edited
  hasUnsavedChanges = ({nextTitle, nextDesc}) => {
    const props = this.props;

    const isEditing = props[MNPCreateQuiz.isEditing];
    const prevTitle = props[MNPCreateQuiz.quizTitle];
    const prevDesc  = props[MNPCreateQuiz.quizDesc ];

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

  _handleOnChangeTextTitle = (text) => {
    this.textTitle = text;
    this.modalRef.setIsModalInPresentation(
      this.hasUnsavedChanges({
        nextTitle: text, 
        nextDesc : this.textDesc,
      })
    );
  };

  _handleOnChangeTextDesc = (text) => {
    this.textDesc = text;
    this.modalRef.setIsModalInPresentation(
      this.hasUnsavedChanges({
        nextTitle: this.textTitle,
        nextDesc : text,
      })
    );
  };

  //#region - ModalView Events/Handlers
  // ModalView: isModalInPresentation event
  onModalAttemptDismiss = async () => {
    const hasChanges = this.hasUnsavedChanges({
      nextTitle: this.textTitle,
      nextDesc : this.textDesc ,
    });

    if (!hasChanges) return;
    const shouldDiscard = await Helpers.asyncActionSheetConfirm({
      title        : 'Discard Changes',
      message      : 'Looks like you have some unsaved changes, are you sure you want to discard them?',
      confirmText  : 'Discard',
      isDestructive: true,
    });

    if(shouldDiscard){
      this.modalRef.setVisibilty(false);
    };
  };
  //#endregion

  // modalFooter: confirm onPress
  _handleOnPressButtonLeft = async () => {
    const { navigation, ...props } = this.props;
    
    const hasChanges = this.hasUnsavedChanges({
      nextTitle: this.textTitle,
      nextDesc : this.textDesc ,
    });

    const isEditing   = props[MNPCreateQuiz.isEditing  ];
    const onPressDone = props[MNPCreateQuiz.onPressDone];

    const isValidTitle    = this.inputFieldRefTitle.isValid(false);
    const isValidSubtitle = this.inputFieldRefDesc .isValid(false);

    if(!hasChanges && isEditing){
      //no changes, close modal
      this.modalRef.setVisibilty(false);

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
      onPressDone?.({title, desc});

      //close modal
      this.modalRef.setVisibilty(false);

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
    const didChange = this.hasUnsavedChanges({
      nextTitle: this.textTitle,
      nextDesc : this.textDesc ,
    });

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
    this.modalRef.setVisibilty(false);
  };

  render(){
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
      <ModalBody
        useKeyboardSpacer={true}
        {...{modalHeader, modalFooter, overlay}}
      >
        <ModalSection
          extraPaddingTop={true}
          showBorderTop={false}
        >
          <ModalInputField
            index={0}
            ref={r => this.inputFieldRefTitle = r}
            inputRef={r => this.inputRefTitle = r}
            title={'Quiz Title'}
            subtitle={'Give this quiz a title (ex: Math Prelims etc.)'}
            placeholder={'Enter Quiz Title'}
            initialValue={props[MNPCreateQuiz.quizTitle]}
            onSubmitEditing={this._handleOnSubmitEditing}
            onChangeText={this._handleOnChangeTextTitle}
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
            returnKeyType={'done'}
            onChangeText={this._handleOnChangeTextDesc}
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
      </ModalBody>
    );
  };
};
