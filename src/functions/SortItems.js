import { QuizKeys } from 'app/src/models/QuizModel';
import { SortKeysQuiz } from 'app/src/constants/SortValues';

const SortKeyMapQuiz = {
  [SortKeysQuiz.TITLE  ]: QuizKeys.quizTitle        ,
  [SortKeysQuiz.CREATED]: QuizKeys.quizDateCreated  ,
  [SortKeysQuiz.TAKEN  ]: QuizKeys.quizDateLastTaken,
  [SortKeysQuiz.COUNT  ]: QuizKeys.quizQuestionCount,
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
    case SortKeysQuiz.TITLE: 
      return sortItemsByString(items, SortKeyMapQuiz[sortBy], isAsc);
    //number
    case SortKeysQuiz.CREATED:
    case SortKeysQuiz.TAKEN  :
    case SortKeysQuiz.COUNT  :
      return sortItemsByNumber(items, SortKeyMapQuiz[sortBy], isAsc);
  };
};

