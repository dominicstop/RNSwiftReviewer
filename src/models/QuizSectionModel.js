import { IS_DEBUG } from "app/src/constants/Options";
import * as Helpers from "app/src/functions/helpers";

import { QuizSectionKeys } from 'app/src/constants/PropKeys';

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

// create object with keys and ass. null values
const defaultValues = IS_DEBUG && Helpers.createObjectFromKeys(QuizSectionKeys);

export class QuizSectionModel {
  // default values
  static stucture = {
    quizID              : '',
    sectionID           : '',
    sectionTitle        : '',
    sectionDesc         : '',
    sectionType         : '',
    sectionDateCreated  : '',
    sectionQuestionCount: 0 ,
    sectionQuestions    : [],
  };

  static wrap(object = QuizSectionModel.stucture){
    return ({
      // helps vscode infer types
      ...(IS_DEBUG && QuizSectionModel.stucture),
      ...(IS_DEBUG && defaultValues),
      // pass down object
      ...(object ?? {}),
    });
  };

  constructor(values = {}){
    this.values = QuizSectionModel.wrap(values);
  };

  set quizID(id = ''){
    this.values[QuizSectionKeys.quizID] = id;
  };

  set title(title = ''){
    this.values[QuizSectionKeys.sectionTitle] = title;
  };

  set desc(desc = ''){
    this.values[QuizSectionKeys.sectionDesc] = desc;
  };

  set type(type = ''){
    this.values[QuizSectionKeys.sectionType] = type;
  };

  setDateCreated(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[QuizSectionKeys.sectionDateCreated] = ts;
  };

  setSectionID(){
    const quizID  = this.values[QuizSectionKeys.quizID];
    const title   = this.values[QuizSectionKeys.sectionTitle];
    const desc    = this.values[QuizSectionKeys.sectionDesc];
    const type    = this.values[QuizSectionKeys.sectionType];
    const created = this.values[QuizSectionKeys.sectionDateCreated];

    const hashCode = Helpers.stringHash(title + desc);

    this.values[QuizSectionKeys.sectionID] = (
      `section-type:${type}-date:${created}-hash:${hashCode}-quiz:${quizID}`
    );
  };

};