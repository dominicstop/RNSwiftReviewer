import { IS_DEBUG } from "app/src/constants/Options";
import { QuizSessionKeys, QuizKeys, QuizSectionKeys, QuizQuestionKeys, QuizSessionAnswerKeys } from 'app/src/constants/PropKeys';
import { SectionTypes } from "app/src/constants/SectionTypes";

import * as Helpers from "app/src/functions/helpers";


const PRINT_DEBUG = (
  IS_DEBUG && false
);


// This model is in charge of recording the answers from a
// quiz session.
export class QuizSessionAnswerModel {
  // default values
  static stucture = {
  };

  constructor(){
    // key/value map of answers
    // - questionID: { QuizSessionAnswerKeys }
    this.answers = {};
  };

  initFromSession(session){
    this.quizID    = session[QuizSessionKeys.quizID   ];
    this.sessionID = session[QuizSessionKeys.sessionID];

    if(PRINT_DEBUG){
      console.log('----------------------------------------');
      console.log('QuizSessionAnswerModel - initFromSession');
      console.log(`quizID   : ${this.quizID   }`);
      console.log(`sessionID: ${this.sessionID}`);
      console.log('////');
    };
  };

  addAnswer(question = {}, answerValue){
    const sectionID   = question[QuizQuestionKeys.sectionID  ];
    const sectionType = question[QuizQuestionKeys.sectionType];
    const questionID  = question[QuizQuestionKeys.questionID ];

    // get timestamp now
    const date      = new Date();
    const timestamp = date.getTime();

    const doesAnswerExist = (
      // check if answer already exists
      (this.answers[questionID] !== undefined)
    );

    if(!doesAnswerExist){
      // create answerID
      const answerID = (
        `answerID:(${questionID})-sessionID:(${this.sessionID})`
      );

      // record new answer
      this.answers[questionID] = {
        // init values - from session
        [QuizSessionAnswerKeys.quizID   ]: this.quizID   ,
        [QuizSessionAnswerKeys.sessionID]: this.sessionID,
        // init values - from question
        [QuizSessionAnswerKeys.sectionID  ]: sectionID  ,
        [QuizSessionAnswerKeys.sectionType]: sectionType,
        [QuizSessionAnswerKeys.questionID ]: questionID ,
        // init values - answer
        [QuizSessionAnswerKeys.answerID       ]: answerID    ,
        [QuizSessionAnswerKeys.answerValue    ]: answerValue ,
        [QuizSessionAnswerKeys.answerTimestamp]: timestamp   ,
        // init answerValueHistory w/ empty array
        [QuizSessionAnswerKeys.answerValueHistory]: [],
      };

      // debug - log
      if(PRINT_DEBUG){
        console.log('-----------------------------------');
        console.log('QuizSessionAnswerModel -- addAnswer');
        console.log(`timestamp      : ${timestamp      }`);
        console.log(`answerValue    : ${answerValue    }`);
        console.log(`doesAnswerExist: ${doesAnswerExist}`);
        console.log(this.answers[questionID]);
        console.log('////');
      };

    } else {
      // save a copy of the prev ans
      const prevAnswer = {
        ...this.answers[questionID],
      };

      const prevAnswerValueHistory =
        prevAnswer[QuizSessionAnswerKeys.answerValueHistory];
      
      this.answers[questionID] = {
        ...prevAnswer,
        // save new answer values
        [QuizSessionAnswerKeys.answerValue    ]: answerValue ,
        [QuizSessionAnswerKeys.answerTimestamp]: timestamp   ,
        // update answerValueHistory
        [QuizSessionAnswerKeys.answerValueHistory]: [
          // append prev. answers
          ...prevAnswerValueHistory,
          {
            // append prev answer
            [QuizSessionAnswerKeys.answerValue    ]: prevAnswer[QuizSessionAnswerKeys.answerValue    ],
            [QuizSessionAnswerKeys.answerTimestamp]: prevAnswer[QuizSessionAnswerKeys.answerTimestamp],
          }
        ],
      };
    };

    // debug - log
    if(PRINT_DEBUG){
      console.log('-----------------------------------');
      console.log('QuizSessionAnswerModel -- addAnswer');
      console.log(`timestamp      : ${timestamp      }`);
      console.log(`answerValue    : ${answerValue    }`);
      console.log(`doesAnswerExist: ${doesAnswerExist}`);
      console.log('this.answers[questionID]:');
      console.log(this.answers[questionID]);
      console.log('this.answers:');
      console.log(JSON.stringify(this.answers));
      console.log('////');
    };
  };
};