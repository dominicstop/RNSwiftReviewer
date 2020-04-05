//SNP: Screen Navigation Params
//MNP: Modal  Navigation Params

//CreateQuizScreen nav params
export const SNPCreateQuiz = {
  quizTitle: 'quizTitle',
  quizDesc : 'quizDesc' ,
};

// CreateQuizModal open modal params
export const MNPCreateQuiz = {
  navigation   : 'navigation'   ,
  isEditing    : 'isEditing'    ,
  quizTitle    : 'quizTitle'    ,
  quizDesc     : 'quizDesc'     ,
  onPressDone  : 'onPressDone'  ,
  onPressDelete: 'onPressDelete',
};

// CreateQuizAddSectionModal open modal params
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
  isEditing   : 'isEditing'   ,
  quizSection : 'quizSection' ,
  quizQuestion: 'quizQuestion',
  onPressDone : 'onPressDone' ,
};

