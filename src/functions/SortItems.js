import { QuizKeys } from 'app/src/models/QuizModel';
import { SortTypesQuiz } from 'app/src/constants/SortValues';

const SortKeyMapQuiz = {
  [SortTypesQuiz.TITLE  ]: QuizKeys.quizTitle        ,
  [SortTypesQuiz.CREATED]: QuizKeys.quizDateCreated  ,
  [SortTypesQuiz.TAKEN  ]: QuizKeys.quizDateLastTaken,
  [SortTypesQuiz.COUNT  ]: QuizKeys.quizQuestionCount,
};

export function sortItemsByString(items = [], key = '', isAsc){
  return items.sort((a, b) => isAsc? (
    (a[key] > b[key])? -1 :
    (a[key] < b[key])?  1 : 0
  ):(
    (a[key] < b[key])? -1 :
    (a[key] > b[key])?  1 : 0
  ));
};

export function sortItemsByNumber(items = [], key = '', isAsc){
  return items.sort((a, b) => isAsc
    ? (a[key] - b[key])
    : (b[key] - a[key])
  );
};

export function sortQuizItems(items = [], sortBy = '', isAsc = false){
  switch (sortBy) {
    //string
    case SortTypesQuiz.TITLE: 
      return sortItemsByString(items, SortKeyMapQuiz[sortBy], isAsc);
    //number
    case SortTypesQuiz.CREATED:
    case SortTypesQuiz.TAKEN  :
    case SortTypesQuiz.COUNT  :
      return sortItemsByNumber(items, SortKeyMapQuiz[sortBy], isAsc);
  };
};

