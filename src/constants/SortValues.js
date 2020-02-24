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
export const SortKeysQuiz = {
  'TITLE'   : 'TITLE'   , // sort by quiz title
  'CREATED' : 'CREATED' , // sort by quiz date created
  'MODIFIED': 'MODIFIED', // sort by quiz date modified
  'COUNT'   : 'COUNT'   , // sort by quiz number of questions
};

export const SortValuesQuiz = {
  [SortKeysQuiz.TITLE]: {
    [SortKeys.TITLE  ]: "Quiz Title",
    [SortKeys.DISPLAY]: "Quiz",
    [SortKeys.DESC   ]: "Sort by the quiz title",
  },
  [SortKeysQuiz.CREATED]: {
    [SortKeys.TITLE  ]: "Date Created",
    [SortKeys.DISPLAY]: "Created",
    [SortKeys.DESC   ]: "Sort by quiz created date",
  },
  [SortKeysQuiz.MODIFIED]: {
    [SortKeys.TITLE  ]: "Date Modified",
    [SortKeys.DISPLAY]: "Modified",
    [SortKeys.DESC   ]: "Sort by quiz modified date",
  },
  [SortKeysQuiz.COUNT]: {
    [SortKeys.TITLE  ]: "Question Count",
    [SortKeys.DISPLAY]: "Count",
    [SortKeys.DESC   ]: "Sort by quiz question count",
  },
};
//#endregion