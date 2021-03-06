//SNP: Screen Navigation Params
//MNP: Modal  Navigation Params


// CreateQuizScreen nav params
export const SNPCreateQuiz = {
  quizTitle: 'quizTitle',
  quizDesc : 'quizDesc' ,
};

// QuizSessionScreen nav params
export const SNPQuizSession = {
  quiz: 'quiz',
};

// QuizSessionResultScreen nav params
export const SNPQuizSessionResult = {
  quiz    : 'quiz'    ,
  quizes  : 'quiz'    ,
  session : 'session' ,
  sessions: 'sessions',
};

// #region - open modal params
// These are params you need to pass when opening a modal

// ViewQuizModal
export const MNPViewQuiz = {
  quiz      : 'quiz'      ,
  sessions  : 'sessions'  ,
  navigation: 'navigation',
  // events
  onPressStartQuiz : 'onPressStartQuiz' ,
  onPressDeleteQuiz: 'onPressDeleteQuiz',
};

// CreateQuizModal
export const MNPCreateQuiz = {
  navigation: 'navigation',
  isEditing : 'isEditing' ,
  quizTitle : 'quizTitle' ,
  quizDesc  : 'quizDesc'  ,
  // events
  onPressDone  : 'onPressDone'  ,
  onPressDelete: 'onPressDelete',
};

// CreateQuizAddSectionModal
export const MNPQuizAddSection = {
  section      : 'section'      ,
  isEditing    : 'isEditing'    ,
  navigation   : 'navigation'   ,
  onPressDone  : 'onPressDone'  ,
  onPressDelete: 'onPressDelete',
};

// QuizAddQuestionModal
export const MNPQuizAddQuestion = {
  quizSection: 'quizSection',
  onPressDone: 'onPressDone',
};

export const MNPQuizAddQuestionEditList = {
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

// QuizSessionChooseAnswerModal
export const MNPQuizSessionChooseAnswer = {
  quiz          : 'quiz',
  question      : 'question',
  answer        : 'answer',
  answers       : 'answers',
  sectionChoices: 'sectionChoices',
  onPressDone   : 'onPressDone',
};

// QuizSessionDoneModal
export const MNPQuizSessionDoneModal = {
  quiz           : 'quiz'           ,
  answers        : 'answers'        ,
  session        : 'session'        ,
  bookmarks      : 'bookmarks'      ,
  questions      : 'questions'      ,
  currentIndex   : 'currentIndex'   ,
  currentQuestion: 'currentQuestion',
  onPressDone    : 'onPressDone'    ,
  onPressQuestion: 'onPressQuestion',
  updateBookmarks: 'updateBookmarks',
};

// QuizSessionQuestionModal
export const MNPQuizSessionQuestion = {
  quiz           : 'quiz'           ,
  answers        : 'answers'        ,
  session        : 'session'        ,
  questions      : 'questions'      ,
  bookmarks      : 'bookmarks'      ,
  currentIndex   : 'currentIndex'   ,
  currentQuestion: 'currentQuestion',
  onPressQuestion: 'onPressQuestion',
  updateBookmarks: 'updateBookmarks',
};
// #endregion
