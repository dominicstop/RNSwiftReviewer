import { IS_DEBUG } from "app/src/constants/Options";
import { QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';

import * as Helpers from "app/src/functions/helpers";


// create object with keys and ass. null values
const defaultValues = IS_DEBUG && Helpers.createObjectFromKeys(QuizSectionKeys);

const debug = true;

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

  static extract(values){
    let   copy = QuizSectionModel.wrap({});
    const keys = Object.keys(QuizSectionKeys);

    for (const key of keys) {
      copy[key] = values[key];
    };

    return {...copy};
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

    const hashCode = Helpers.stringHash(
      (title + desc + quizID)
    );

    this.values[QuizSectionKeys.sectionID] = (
      `sectionType:${type}-date:${created}-hash:${hashCode}`
    );
  };

  addQuestion(question = {}){
    const questions = this.values?.[QuizSectionKeys.sectionQuestions] ?? [];
    
    const newQuestions = [ ...questions, {
      ...question,
      [QuizQuestionKeys.quizID   ]: this.values[QuizSectionKeys.quizID   ],
      [QuizQuestionKeys.sectionID]: this.values[QuizSectionKeys.sectionID],
    }];

    this.values[QuizSectionKeys.sectionQuestions    ] = newQuestions;
    this.values[QuizSectionKeys.sectionQuestionCount] = newQuestions.length;
  };

  updateQuestion(updatedQuestion = {}){
    // local copy of sectionQuestions
    const questionsCopy = [
      ...(this.values[QuizSectionKeys.sectionQuestions] ?? [])
    ];

    const newQuestionID = updatedQuestion[QuizQuestionKeys.questionID];

    for (let index = 0; index < questionsCopy.length; index++) {
      const question = questionsCopy[index];
      const questionID = question[QuizQuestionKeys.questionID];
      
      if(newQuestionID == questionID){
        questionsCopy[index] = { ...question,
          // pass down updated question values
          [QuizQuestionKeys.questionText   ]: updatedQuestion[QuizQuestionKeys.questionText   ],
          [QuizQuestionKeys.questionAnswer ]: updatedQuestion[QuizQuestionKeys.questionAnswer ],
          [QuizQuestionKeys.questionChoices]: updatedQuestion[QuizQuestionKeys.questionChoices],
        };
      };
    };

    // assign changes made from copy
    this.values[QuizSectionKeys.sectionQuestions] = questionsCopy;
  };
};