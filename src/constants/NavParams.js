//SNP: Screen Navigation Params
//MNP: Modal  Navigation Params


// CreateQuizScreen nav params
export const SNPCreateQuiz = {
  quizTitle: 'quizTitle',
  quizDesc : 'quizDesc' ,
};


// #region - open modal params
// These are params you need to pass when opening a modal

// ViewQuizModal
export const MNPViewQuiz = {
  quiz: 'quiz',
  onPressStartQuiz: 'onPressStartQuiz',
};

// CreateQuizModal
export const MNPCreateQuiz = {
  navigation   : 'navigation'   ,
  isEditing    : 'isEditing'    ,
  quizTitle    : 'quizTitle'    ,
  quizDesc     : 'quizDesc'     ,
  onPressDone  : 'onPressDone'  ,
  onPressDelete: 'onPressDelete',
};

// CreateQuizAddSectionModal
export const MNPQuizAddSection = {
  navigation   : 'navigation'   ,
  isEditing    : 'isEditing'    ,
  sectionTitle : 'sectionTitle' ,
  sectionDesc  : 'sectionDesc'  ,
  sectionType  : 'sectionType'  ,
  sectionID    : 'sectionID'    ,
  onPressDone  : 'onPressDone'  ,
  onPressDelete: 'onPressDelete',
};

// QuizAddQuestionModal
export const MNPQuizAddQuestion = {
  quizSection: 'quizSection',
  onPressDone: 'onPressDone',
};

// QuizCreateQuestionModal
export const MNPQuizCreateQuestion = {
  isEditing    : 'isEditing'    ,
  quizSection  : 'quizSection'  ,
  quizQuestion : 'quizQuestion' ,
  onPressDone  : 'onPressDone'  ,
  onPressDelete: 'onPressDelete',
};

// #endregion
