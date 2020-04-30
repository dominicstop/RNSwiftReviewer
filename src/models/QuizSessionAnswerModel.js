import { QuizSessionKeys, QuizQuestionKeys, QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';
import { SectionTypes } from "app/src/constants/SectionTypes";

import * as Helpers from "app/src/functions/helpers";



// This model is in charge of recording the answers from a
// quiz session.
export class QuizSessionAnswerModel {
  // default values
  static stucture = {
  };

  constructor(){
    // key/value map of answers
    // - questionID: { QuizSessionAnswerKeys }
    this.answerMap = {};
  };

  initFromSession(session){
    this.quizID    = session[QuizSessionKeys.quizID   ];
    this.sessionID = session[QuizSessionKeys.sessionID];
  };

  addAnswer(question = {}, answerValue){
    const sectionID   = question[QuizQuestionKeys.sectionID     ];
    const sectionType = question[QuizQuestionKeys.sectionType   ];
    const questionID  = question[QuizQuestionKeys.questionID    ];
    const answerKey   = question[QuizQuestionKeys.questionAnswer];

    // get timestamp now
    const date      = new Date();
    const timestamp = date.getTime();

    // check if answer already exists
    const doesAnswerExist =
      (this.answerMap[questionID] !== undefined);

    if(!doesAnswerExist){
      // create answerID
      const answerID =
        `answerID:(${questionID})-sessionID:(${this.sessionID})`;

      // record new answer
      this.answerMap[questionID] = {
        // init values - from session
        [QuizSessionAnswerKeys.quizID   ]: this.quizID   ,
        [QuizSessionAnswerKeys.sessionID]: this.sessionID,
        // init values - from question
        [QuizSessionAnswerKeys.sectionID  ]: sectionID  ,
        [QuizSessionAnswerKeys.sectionType]: sectionType,
        [QuizSessionAnswerKeys.questionID ]: questionID ,
        // init values - answer
        [QuizSessionAnswerKeys.answerID       ]: answerID   ,
        [QuizSessionAnswerKeys.answerValue    ]: answerValue,
        [QuizSessionAnswerKeys.answerTimestamp]: timestamp  ,
        // init answerValueHistory w/ empty array
        [QuizSessionAnswerKeys.answerValueHistory]: [],
      };

    } else {
      // save a copy of the prev ans
      const prevAnswer = {
        ...this.answerMap[questionID],
      };

      const prevAnswerValueHistory =
        prevAnswer[QuizSessionAnswerKeys.answerValueHistory];
      
      this.answerMap[questionID] = {
        ...prevAnswer,
        // save new answer values
        [QuizSessionAnswerKeys.answerValue    ]: answerValue ,
        [QuizSessionAnswerKeys.answerTimestamp]: timestamp   ,
        // update answerValueHistory
        [QuizSessionAnswerKeys.answerValueHistory]: [
          // append prev. answers
          ...prevAnswerValueHistory, {
            // append prev answer
            [QuizSessionAnswerKeys.answerValue    ]: prevAnswer[QuizSessionAnswerKeys.answerValue    ],
            [QuizSessionAnswerKeys.answerTimestamp]: prevAnswer[QuizSessionAnswerKeys.answerTimestamp],
          }
        ],
      };
    };
  };
};