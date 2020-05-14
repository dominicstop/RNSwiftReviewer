import { QuizSessionKeys, QuizQuestionKeys, QuizSessionResultKeys, QuizSessionAnswerKeys, QuizSessionScoreKeys } from 'app/src/constants/PropKeys';
import { SectionTypes } from "app/src/constants/SectionTypes";

import isEmpty from 'lodash/isEmpty';
import * as Helpers from "app/src/functions/helpers";


function checkIfCorrect(question, answer){  
  const answerKey   = question[QuizQuestionKeys.questionAnswer];
  const sectionType = question[QuizQuestionKeys.sectionType   ];

  const answerVal = answer?.[QuizSessionAnswerKeys.answerValue];

  switch (sectionType) {
    case SectionTypes.TRUE_OR_FALSE  :
    case SectionTypes.MATCHING_TYPE  :
    case SectionTypes.MULTIPLE_CHOICE: 
      return(answerKey == answerVal);

    case SectionTypes.IDENTIFICATION:
      const ansValLower = answerVal?.toLowerCase() ?? '';
      const ansKeyLower = answerKey?.toLowerCase() ?? '';

      const ansValTrimmed = ansValLower.replace(/\s+/g, '');
      const ansKeyTrimmed = ansKeyLower.replace(/\s+/g, '');

      return (ansValTrimmed == ansKeyTrimmed);
  };
};

export class QuizSessionResultModel {
  constructor(props){
    this.session   = {};
    this.answerMap = {};
    this.questions = [];

    this.results = [];
    this.score   = {};
  };

  setQuestions(questions = []){
    this.questions = [ ...questions ];
  };

  initFromSession(session = {}){
    const answers = session[QuizSessionKeys.sessionAnswers];

    this.session   = { ...session };
    this.answers   = { ...answers };
  };

  processResults(){
    const questions = this.questions;
    const answers   = this.answers;
    const session   = this.session;

    // check if values are init.
    if(isEmpty(session  )) throw new Error('processResults: Session cannot be empty');
    if(isEmpty(questions)) throw new Error('processResults: questions cannot be empty');

    // score counters
    let wrong      = 0;
    let correct    = 0;
    let unanswered = 0;

    const sessionID = session[QuizSessionKeys.sessionID];

    this.results = questions.map((question) => {
      const questionID  = question[QuizQuestionKeys.questionID];

      const answer    = answers[questionID];
      const isCorrect = checkIfCorrect(question, answer);
      const hasAnswer = (answer != null || answer != undefined);

      // increment counters
      (hasAnswer && isCorrect )? correct++ :
      (hasAnswer && !isCorrect)? wrong  ++ : unanswered++;

      return ({
        // pass down values
        [QuizSessionResultKeys.quizID     ]: question[QuizQuestionKeys.quizID     ],
        [QuizSessionResultKeys.sectionID  ]: question[QuizQuestionKeys.sectionID  ],
        [QuizSessionResultKeys.sectionType]: question[QuizQuestionKeys.sectionType],
        [QuizSessionResultKeys.questionID ]: questionID,
        [QuizSessionResultKeys.sessionID  ]: sessionID ,
        // init result values
        [QuizSessionResultKeys.resultHasAnswer]: hasAnswer,
        [QuizSessionResultKeys.resultIsCorrect]: hasAnswer && isCorrect,
      });
    });

    const incorrect  = (wrong + unanswered);
    const totalItems = questions?.length ?? 0;

    const percentWrong      = Helpers.roundToTwo((wrong      / totalItems) * 100);
    const percentCorrect    = Helpers.roundToTwo((correct    / totalItems) * 100);
    const percentIncorrect  = Helpers.roundToTwo((incorrect  / totalItems) * 100);
    const percentUnanswered = Helpers.roundToTwo((unanswered / totalItems) * 100);

    // set score values
    this.score = {
      [QuizSessionScoreKeys.scoreWrong            ]: wrong            ,
      [QuizSessionScoreKeys.scoreCorrect          ]: correct          ,
      [QuizSessionScoreKeys.scoreIncorrect        ]: incorrect        ,
      [QuizSessionScoreKeys.scoreUnanswered       ]: unanswered       ,
      [QuizSessionScoreKeys.scoreTotalItems       ]: totalItems       ,
      [QuizSessionScoreKeys.scorePercentWrong     ]: percentWrong     ,
      [QuizSessionScoreKeys.scorePercentCorrect   ]: percentCorrect   ,
      [QuizSessionScoreKeys.scorePercentIncorrect ]: percentIncorrect ,
      [QuizSessionScoreKeys.scorePercentUnanswered]: percentUnanswered,
    };
  };
};