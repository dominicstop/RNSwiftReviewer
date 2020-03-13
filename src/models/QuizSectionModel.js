import { IS_DEBUG } from "app/src/constants/Options";
import * as Helpers from "app/src/functions/helpers";

import { SectionKeys } from 'app/src/constants/PropKeys';

//section types enum
export const SectionTypes = {
  TRUE_OR_FALSE  : 'TRUE_OR_FALSE'  ,
  MATCHING_TYPE  : 'MATCHING_TYPE'  ,
  IDENTIFICATION : 'IDENTIFICATION' ,
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
};

// create object with keys and ass. null values
const defaultValues = IS_DEBUG && Helpers.createObjectFromKeys(SectionKeys);

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
  };

  static wrap(object = QuizSectionModel.stucture){
    return ({
      // helps vscode infer types
      ...(IS_DEBUG && QuizSectionModel.stucture),
      ...(IS_DEBUG && defaultValues     ),
      // pass down object
      ...(object ?? {}),
    });
  };

  constructor(values = {}){
    this.values = {
      ...QuizSectionModel.stucture,
      ...values,
    };
  };

  set quizID(id = ''){
    this.values[SectionKeys.quizID] = id;
  };

  set title(title = ''){
    this.values[SectionKeys.sectionTitle] = title;
  };

  set desc(desc = ''){
    this.values[SectionKeys.sectionDesc] = desc;
  };

  set type(type = ''){
    this.values[SectionKeys.sectionType] = type;
  };

  setDateCreated(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[SectionKeys.sectionDateCreated] = ts;
  };

  setSectionID(){
    const quizID  = this.values[SectionKeys.quizID];
    const created = this.values[SectionKeys.sectionDateCreated];
    const title   = this.values[SectionKeys.sectionTitle];
    const desc    = this.values[SectionKeys.sectionDesc];
    const type    = this.values[SectionKeys.sectionType];

    const hashCode = Helpers.stringHash(title + desc);

    this.values[SectionKeys.quizID] = (
      `section-${type}-${created}-${hashCode}-${quizID}`
    );
  };

};