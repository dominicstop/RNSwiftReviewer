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