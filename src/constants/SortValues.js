// DESCRIPTION:
// Used in ListSortItems and related comps
// Used for describing possible sort options


export const SortKeys = {
  TITLE  : 'TITLE'  , // sort title
  DESC   : 'DESC'   , // sort description
  DISPLAY: 'DISPLAY', // sort short title
};

export function getNextSort(sortByIndex, isAsc, sortKeysType){  
  const max  = Object.keys(sortKeysType).length;
  const next = ((sortByIndex + 1) % max);
  
  return({
    isAsc: !isAsc, 
    ...(isAsc
      ? { sortByIndex: next }
      : { sortByIndex }
    ),
  });
};

//#region - Quizes
export const SortTypesQuiz = {
  'TITLE'  : 'TITLE'  , // sort by quiz title
  'CREATED': 'CREATED', // sort by quiz date created
  'TAKEN'  : 'TAKEN'  , // sort by quiz date modified
  'COUNT'  : 'COUNT'  , // sort by quiz number of questions
};

export const SortValuesQuiz = {
  [SortTypesQuiz.TITLE]: {
    [SortKeys.TITLE  ]: "Quiz Title",
    [SortKeys.DISPLAY]: "Quiz",
    [SortKeys.DESC   ]: "Sort by the quiz title",
  },
  [SortTypesQuiz.CREATED]: {
    [SortKeys.TITLE  ]: "Date Created",
    [SortKeys.DISPLAY]: "Created",
    [SortKeys.DESC   ]: "Sort by quiz created date",
  },
  [SortTypesQuiz.TAKEN]: {
    [SortKeys.TITLE  ]: "Date Last Taken",
    [SortKeys.DISPLAY]: "Taken",
    [SortKeys.DESC   ]: "Sort by quiz last taken date",
  },
  [SortTypesQuiz.COUNT]: {
    [SortKeys.TITLE  ]: "Question Count",
    [SortKeys.DISPLAY]: "Count",
    [SortKeys.DESC   ]: "Sort by quiz question count",
  },
};
//#endregion

//#region - Exams
export const SortKeysExam = {
  'TITLE'   : 'TITLE'   , // sort by exam title
  'CREATED' : 'CREATED' , // sort by exam date created
  'MODIFIED': 'MODIFIED', // sort by exam date modified
  'COUNT'   : 'COUNT'   , // sort by exam number of questions
};

export const SortValuesExam = {
  [SortKeysExam.TITLE]: {
    [SortKeys.TITLE  ]: "Exam Title",
    [SortKeys.DISPLAY]: "Exam",
    [SortKeys.DESC   ]: "Sort by the exam title",
  },
  [SortKeysExam.CREATED]: {
    [SortKeys.TITLE  ]: "Date Created",
    [SortKeys.DISPLAY]: "Created",
    [SortKeys.DESC   ]: "Sort by exam created date",
  },
  [SortKeysExam.MODIFIED]: {
    [SortKeys.TITLE  ]: "Date Modified",
    [SortKeys.DISPLAY]: "Modified",
    [SortKeys.DESC   ]: "Sort by exam modified date",
  },
  [SortKeysExam.COUNT]: {
    [SortKeys.TITLE  ]: "Question Count",
    [SortKeys.DISPLAY]: "Count",
    [SortKeys.DESC   ]: "Sort by exam question count",
  },
};
//#endregion