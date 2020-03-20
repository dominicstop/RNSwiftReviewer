import { RadioListKeys } from 'app/src/components/RadioList';

// section types values 
// enum types for models/QuizSectionModel
// values for displaying in ui

// section types enum
export const SectionTypes = {
  TRUE_OR_FALSE  : 'TRUE_OR_FALSE'  ,
  MATCHING_TYPE  : 'MATCHING_TYPE'  ,
  IDENTIFICATION : 'IDENTIFICATION' ,
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
};

// display title string
export const SectionTypeTitles = {
  [SectionTypes.TRUE_OR_FALSE  ]: 'True or False'  ,
  [SectionTypes.MATCHING_TYPE  ]: 'Matching Type'  ,
  [SectionTypes.IDENTIFICATION ]: 'Identification' ,
  [SectionTypes.MULTIPLE_CHOICE]: 'Multiple Choice',
};

// descriptions for each section type
export const SectionTypeDescs = {
  [SectionTypes.TRUE_OR_FALSE  ]: 'Questions created in this section are answered by either choosing true or false.',
  [SectionTypes.MATCHING_TYPE  ]: 'Questions are answered by choosing the corresponding answer from a list. The list is shared amongst all the questions in this section.',
  [SectionTypes.IDENTIFICATION ]: 'Questions created in this section are answered by typing out the correct words.' ,
  [SectionTypes.MULTIPLE_CHOICE]: 'Each question in this section is answered by choosing the correct answer among the choices provided.',
};

// Radio List Object Map
// Used in: QuizAddSectionModal for RadioList
export const SectionTypesRadioValuesMap = {
  [SectionTypes.IDENTIFICATION]: {
    [RadioListKeys.type    ]: SectionTypes.IDENTIFICATION,
    [RadioListKeys.title   ]: SectionTypeTitles[SectionTypes.IDENTIFICATION],
    [RadioListKeys.desc    ]: 'Type the answer to the question',
    [RadioListKeys.descLong]: SectionTypeDescs[SectionTypes.IDENTIFICATION],
  }, 
  [SectionTypes.MATCHING_TYPE]: {
    [RadioListKeys.type    ]: SectionTypes.MATCHING_TYPE,
    [RadioListKeys.title   ]: SectionTypeTitles[SectionTypes.MATCHING_TYPE],
    [RadioListKeys.desc    ]: 'Match the correct answer from a list',
    [RadioListKeys.descLong]: SectionTypeDescs[SectionTypes.MATCHING_TYPE],
  },
  [SectionTypes.MULTIPLE_CHOICE]: {
    [RadioListKeys.type    ]: SectionTypes.MULTIPLE_CHOICE,
    [RadioListKeys.title   ]: SectionTypeTitles[SectionTypes.MULTIPLE_CHOICE],
    [RadioListKeys.desc    ]: 'Choose the correct answer from choices',
    [RadioListKeys.descLong]: SectionTypeDescs[SectionTypes.MULTIPLE_CHOICE],
  },
  [SectionTypes.TRUE_OR_FALSE]: {
    [RadioListKeys.type    ]: SectionTypes.TRUE_OR_FALSE,
    [RadioListKeys.title   ]: SectionTypeTitles[SectionTypes.TRUE_OR_FALSE],
    [RadioListKeys.desc    ]: 'Answer the statement a true/false response',
    [RadioListKeys.descLong]: SectionTypeDescs[SectionTypes.TRUE_OR_FALSE],
  }
};
