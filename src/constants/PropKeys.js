// enum declaration for object property names
// used for defining a model's property key

// property names for QuizModel
export const QuizKeys = {
  quizID           : 'quizID'           ,
  quizTitle        : 'quizTitle'        ,
  quizDesc         : 'quizDesc'         ,
  quizSections     : 'quizSections'     ,
  quizTimesTaken   : 'quizTimesTaken'   ,
  quizDateCreated  : 'quizDateCreated'  ,
  quizDateLastTaken: 'quizDateLastTaken',
  quizQuestionCount: 'quizQuestionCount',
  quizSectionCount : 'quizSectionCount' ,
};

// property names for QuizSectionModel
export const QuizSectionKeys = {
  quizID              : 'quizID'              ,
  sectionID           : 'sectionID'           ,
  sectionTitle        : 'sectionTitle'        ,
  sectionDesc         : 'sectionDesc'         ,
  sectionType         : 'sectionType'         ,
  sectionDateCreated  : 'sectionDateCreated'  ,
  sectionQuestions    : 'sectionQuestions'    ,
  sectionQuestionCount: 'sectionQuestionCount',
};

// property names for QuizQuestionModel
export const QuizQuestionKeys = {
  quizID             : 'quizID'             ,
  sectionID          : 'sectionID'          ,
  sectionType        : 'sectionType'        ,
  questionID         : 'questionID'         ,
  questionText       : 'questionText'       ,
  questionAnswer     : 'questionAnswer'     ,
  questionChoices    : 'questionChoices'    ,
  questionDateCreated: 'questionDateCreated',
};

// property names for QuizSessionModel
export const QuizSessionKeys = {
  quizID             : 'quizID'             ,
  sessionID          : 'sessionID'          ,
  sessionDateStart   : 'sessionDateStart'   ,
  sessionDateEnd     : 'sessionDateEnd'     ,
  sessionDuration    : 'sessionDuration'    ,
  sessionAnswers     : 'sessionAnswers'     ,
  sessionScore       : 'sessionScore'       ,
  sessionResults     : 'sessionResults'     ,
  matchingTypeChoices: 'matchingTypeChoices',
};

// property names for QuizSessionAnswerModel
export const QuizSessionAnswerKeys = {
  quizID            : 'quizID'            ,
  sessionID         : 'sessionID'         ,
  sectionID         : 'sectionID'         ,
  sectionType       : 'sectionType'       ,
  questionID        : 'questionID'        ,
  answerID          : 'answerID'          ,
  answerValue       : 'answerValue'       ,
  answerTimestamp   : 'answerTimestamp'   ,
  answerValueHistory: 'answerValueHistory',
};

// property names for QuizSessionResultModel
export const QuizSessionResultKeys = {
  quizID         : 'quizID'         ,
  sessionID      : 'sessionID'      ,
  sectionID      : 'sectionID'      ,
  sectionType    : 'sectionType'    ,
  questionID     : 'questionID'     ,
  answerID       : 'answerID'       ,
  resultHasAnswer: 'resultHasAnswer',
  resultIsCorrect: 'resultIsCorrect',
};

export const QuizSessionScoreKeys = {
  scoreWrong            : 'scoreWrong'            , // answered wrong
  scoreCorrect          : 'scoreCorrect'          , // answered correctly
  scoreIncorrect        : 'scoreIncorrect'        , // answered wrong / no answer
  scoreUnanswered       : 'scoreUnanswered'       , // no answer / empty
  scoreTotalItems       : 'scoreTotalItems'       , // number of questions
  scorePercentWrong     : 'scorePercentWrong'     ,
  scorePercentCorrect   : 'scorePercentCorrect'   ,
  scorePercentIncorrect : 'scorePercentIncorrect' ,
  scorePercentUnanswered: 'scorePercentUnanswered',
};

// property names for QuizSessionBookmarkModel
export const QuizSessionBookmarkKeys = {
  questionID: 'questionID'
};