import { IS_DEBUG } from "app/src/constants/Options";
import { QuizQuestionKeys, QuizSectionKeys } from 'app/src/constants/PropKeys';

import * as Helpers from "app/src/functions/helpers";


// create object with keys and ass. null values
const defaultValues = IS_DEBUG && Helpers.createObjectFromKeys(QuizQuestionKeys);

export class QuizQuestionModel {
  // default values
  static stucture = {
    quizID         : '',
    sectionID      : '',
    sectionType    : '',
    questionID     : '',
    questionText   : '',
    questionAnswer : '',
    questionChoices: [],
  };

  static wrap(object = QuizQuestionModel.stucture){
    return ({
      // helps vscode infer types
      ...(IS_DEBUG && QuizQuestionModel.stucture),
      ...(IS_DEBUG && defaultValues),
      // pass down object
      ...(object ?? {}),
    });
  };

  static extract(values){
    let   copy = QuizQuestionModel.wrap({});
    const keys = Object.keys(QuizQuestionKeys);

    for (const key of keys) {
      copy[key] = values[key];
    };

    return copy;
  };

  constructor(values = {}){
    this.values = QuizQuestionModel.wrap(values);
  };

  set quizID(id = ''){
    this.values[QuizQuestionKeys.quizID] = id;
  };

  set sectionID(id = ''){
    this.values[QuizQuestionKeys.sectionID] = id;
  };

  set type(type = ''){
    this.values[QuizQuestionKeys.sectionType] = type;
  };

  set questionText(text = ''){
    this.values[QuizQuestionKeys.questionText] = text;
  };

  set answer(answer = ''){
    this.values[QuizQuestionKeys.questionAnswer] = answer;
  };

  setDateCreated(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[QuizQuestionKeys.sectionDateCreated] = ts;
  };

  setQuestionID(){
    const quizID      = this.values[QuizQuestionKeys.quizID];
    const sectionID   = this.values[QuizQuestionKeys.sectionID];
    const sectionType = this.values[QuizQuestionKeys.sectionType];
    const question    = this.values[QuizQuestionKeys.questionText];
    const created     = this.values[QuizQuestionKeys.sectionDateCreated];

    const hashCode = Helpers.stringHash(question);

    this.values[QuizQuestionKeys.sectionID] = (
      `question-type:${sectionType}-date:${created}-hash:${hashCode}-quiz:${quizID}-section:${sectionID}`
    );
  };

  initFromSection(section = {}){
    this.quizID    = section[QuizSectionKeys.quizID];
    this.sectionID = section[QuizSectionKeys.sectionID];

    this.setDateCreated();
    this.setQuestionID();
  };
};