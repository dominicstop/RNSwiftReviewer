import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import { createNativeWrapper } from 'react-native-gesture-handler';

import { ModalBody                  } from 'app/src/components/Modal/ModalBody';
import { ModalHeader                } from 'app/src/components/Modal/ModalHeader';
import { ModalFooter                } from 'app/src/components/Modal/ModalFooter';
import { ModalFooterButton          } from 'app/src/components/Modal/ModalFooterButton';
import { ModalOverlayCheck          } from 'app/src/components/Modal/ModalOverlayCheck';
import { ModalSectionHeader         } from 'app/src/components/Modal/ModalSectionHeader';
import { ModalSectionButton         } from 'app/src/components/Modal/ModalSectionButton';
import { ModalHeaderRightTextButton } from 'app/src/components/Modal/ModalHeaderRightTextButton';

import { QuizAddQuestionModalItem   } from 'app/src/components/QuizAddQuestionModalItem';
import { QuizAddQuestionModalHeader } from 'app/src/components/QuizAddQuestionModalHeader';

import { ModalView } from 'app/src/components_native/ModalView';

import { RNN_ROUTES } from 'app/src/constants/Routes';
import { MNPQuizAddQuestionEditList } from 'app/src/constants/NavParams';
import { QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';

import { QuizSectionModel } from 'app/src/models/QuizSectionModel';
import { ListOrderView, ListOrderItemKeys } from '../components_native/ListOrder';
import _ from 'lodash';


const ListOrderViewWrapper = React.forwardRef((props, ref) => (
  <View style={[props.style, {marginTop: props.topSpace, backgroundColor: 'white'}]}>
    <ListOrderView
      {...{ref, ...props}}
      style={{flex: 1, marginBottom: props.bottomSpace}}
    />
  </View>
));


export class QuizAddQuestionEditListModal extends React.Component {
  constructor(props){
    super(props);

    // get section questions from nav props
    const section   = props  ?.[MNPQuizAddQuestionEditList.quizSection] ?? {};
    const questions = section?.[QuizSectionKeys.sectionQuestions      ] ?? [];

    const listItems = questions.map(question => ({
      [ListOrderItemKeys.id         ]: question[QuizQuestionKeys.questionID    ],
      [ListOrderItemKeys.title      ]: question[QuizQuestionKeys.questionText  ],
      [ListOrderItemKeys.description]: question[QuizQuestionKeys.questionAnswer]
    }));

    this._listDataOriginal = _.cloneDeep(listItems);

    this.state = {
      listData: listItems
    };
  };

  componentDidMount(){
    const { getModalRef } = this.props;
    if(getModalRef){
      // ModalView: receive modal ref
      this.modalRef = getModalRef();
    };
  };

  hasUnsavedChanges = () => {
    return !(_.isEqual(
      this._listDataOriginal, 
      this.state.listData
    ));
  };

  _handleOnListItemsChange = (listData) => {
    this.setState({listData});
  };

  // ModalFooter: save button
  _handleOnPressButtonLeft = async () => {
    const props = this.props;
    const { listData }  = this.state;

    // disable modal swipe gesture
    this.onModalAttemptDismiss = null;
    await this.modalRef.setEnableSwipeGesture(false);

    const hasChanges = this.hasUnsavedChanges();
    if(hasChanges){
      let   section     = props[MNPQuizAddQuestionEditList.quizSection];
      const onPressDone = props[MNPQuizAddQuestionEditList.onPressDone];

      const questions = 
        section?.[QuizSectionKeys.sectionQuestions] ?? [];

      let questionMap = {};
      for (const question of questions) {
        questionMap[question[QuizQuestionKeys.questionID]] = {...question};
      };

      const updatedQuestions = listData.map(listItem => 
        questionMap[listItem[ListOrderItemKeys.id]]
      );

      section[QuizSectionKeys.sectionQuestions    ] = updatedQuestions;
      section[QuizSectionKeys.sectionQuestionCount] = updatedQuestions?.length;

      onPressDone?.({quizSection: section});
      await this.overlay.start();
    };

    this.modalRef.setVisibility(false);
  };

  // ModalFooter: cancel button
  _handleOnPressButtonRight = async () => {
    const didChange = this.hasUnsavedChanges();

    // disable modal swipe gesture
    this.onModalAttemptDismiss = null;
    await this.modalRef.setEnableSwipeGesture(false);
    await Helpers.timeout(200);

    if(didChange){
      const shouldDiscard = await Helpers.asyncActionSheetConfirm({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard all of your changes?',
        confirmText: 'Discard',
        isDestructive: true,
      });

      // early exit if cancel
      if(!shouldDiscard) return;
    };
    
    // close modal
    this.modalRef.setVisibility(false);
  };

  render(){

    const modalHeader = (
      <ModalHeader
        title={'Edit Question List'}
        subtitle={"Reorder/Delete this section's questions"}
        headerIcon={(
          <Ionicon
            style={{marginTop: 3}}
            name={'ios-list'}
            size={22}
          />
        )}
      />
    );

    const modalFooter = (
      <ModalFooter>
        <ModalFooterButton
          buttonLeftTitle={'Save'}
          buttonLeftSubtitle={'Confirm changes'}
          buttonRightSubtitle={'Discard Changes'}
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

    return(
      <ModalBody
        ref={r => this.modalBgRef = r}
        wrapInScrollView={false}
        passScrollviewProps={false}
        {...{modalHeader, modalFooter, overlay}}
      >
        <ListOrderViewWrapper
          ref={r => this.listOrderRef = r}
          style={styles.list}
          descLabel={"Answer: "}
          isEditable={true}
          listData={this.state.listData}
          onListItemsChange={this._handleOnListItemsChange}
        />
      </ModalBody>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginTop: 70,
  },
  list: {
    flex: 1,
  },
});