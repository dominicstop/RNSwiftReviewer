import { IS_DEBUG } from "app/src/constants/Options";
import { QuizQuestionKeys, QuizSectionKeys } from 'app/src/constants/PropKeys';
import { SectionTypes } from 'app/src/constants/SectionTypes';

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
    questionChoices: [], // used in multpiple choice
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

  set choices(choices = []){
    const prevChoices = this.values[QuizQuestionKeys.questionChoices] ?? [];
    const nextChoices = new Set([...prevChoices, ...choices]);

    this.values[QuizQuestionKeys.questionChoices] = [...nextChoices];
  };

  setDateCreated(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[QuizQuestionKeys.questionDateCreated] = ts;
  };

  setQuestionID(){
    const quizID      = this.values[QuizQuestionKeys.quizID];
    const sectionID   = this.values[QuizQuestionKeys.sectionID];
    const sectionType = this.values[QuizQuestionKeys.sectionType];
    const created     = this.values[QuizQuestionKeys.questionDateCreated];

    const hashCode = Helpers.stringHash(
      `quiz:${quizID}-section:${sectionID}`
    );

    this.values[QuizQuestionKeys.questionID] = (
      `question-type:${sectionType}-date:${created}-hash:${hashCode}`
    );
  };

  initFromSection(section = {}){
    this.values[QuizQuestionKeys.quizID     ] = section[QuizSectionKeys.quizID     ];
    this.values[QuizQuestionKeys.sectionID  ] = section[QuizSectionKeys.sectionID  ];
    this.values[QuizQuestionKeys.sectionType] = section[QuizSectionKeys.sectionType];

    this.setDateCreated();
    this.setQuestionID();
  };

  addChoice(choice = ''){
    const type = this.values[QuizQuestionKeys.sectionType];
    
    if(type === SectionTypes.MULTIPLE_CHOICE){
      const choices = this.values[QuizQuestionKeys.questionChoices];

      this.values[QuizQuestionKeys.questionChoices] = [
        ...(choices ?? []), choice
      ];

    } else {
      console.log(
        `Cannot add choice. SectionType is ${type}`
      );
    };
  };

  addChoices(choices = []){
    this.values[QuizQuestionKeys.questionChoices] = [
      ...this.values[QuizQuestionKeys.questionChoices] ?? [],
      ...choices
    ];
  };

  clearChoices(){
    this.values[QuizQuestionKeys.questionChoices] = [];
  };
};