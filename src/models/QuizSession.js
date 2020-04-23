import { IS_DEBUG } from "app/src/constants/Options";
import { QuizSessionKeys, QuizKeys, QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';

import * as Helpers from "app/src/functions/helpers";
import { SectionTypes } from "../constants/SectionTypes";

function extractQuestionsFromSections(sections = []){
  let questions = [];

  for (const section of sections) {
    const sectionQuestions = section[QuizSectionKeys.sectionQuestions] ?? [];

    for (const question of sectionQuestions) {
      questions.push(question);
    };
  };

  return questions;
};


function extractMatchingTypeChoicesFromSections(sections = []){
  let choices = {};

  for (const section of sections) {
    const type = section[QuizSectionKeys.sectionType];

    if(type === SectionTypes.MATCHING_TYPE){
      const sectionID = section[QuizSectionKeys.sectionID];
      const questions = section[QuizSectionKeys.sectionQuestions];
      
      // extract answers from section
      const answers = questions.map(question => 
        question[QuizQuestionKeys.questionAnswer]
      );

      console.log('answers');
      console.log(answers);
      

      // get rid of duplicate/invalid answers
      const answersUnique   = [...(new Set(answers))];
      const answersFiltered = answersUnique.filter(answer => (
        answer != ''        ||
        answer != null      ||
        answer != undefined 
      ))

      choices[sectionID] = answersFiltered;
    };
  };

  return choices;
};


// create object with keys and ass. null values
const defaultValues = IS_DEBUG && Helpers.createObjectFromKeys(QuizSessionKeys);

export class QuizSessionModel {
  // default values
  static stucture = {
  };

  static wrap(object = QuizSessionModel.stucture){
    return ({
      // helps vscode infer types
      ...(IS_DEBUG && QuizSessionModel.stucture),
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
    this.values = QuizSessionModel.wrap(values);

    this.questions = [];
  };

  initFromQuiz(quiz = {}){
    this.setStartDate();

    const quizID   = quiz[QuizKeys.quizID];
    const sections = quiz[QuizKeys.quizSections];

    const questions = extractQuestionsFromSections(sections);
    this.questions = questions;

    const matchingTypeChoices = extractMatchingTypeChoicesFromSections(sections);

    this.values[QuizSessionKeys.quizID             ] = quizID;
    this.values[QuizSessionKeys.matchingTypeChoices] = matchingTypeChoices;
  };

  setStartDate(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[QuizSessionKeys.dateStart] = ts;
  };

  setEndDate(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[QuizSessionKeys.dateEnd] = ts;
  };

  set quizID(id = ''){
    this.values[QuizSessionKeys.quizID] = id;
  };

  set sessionID(id = ''){
    this.values[QuizSessionKeys.sessionID] = id;
  };

  get currentQuestions(){
    return [...this.questionsCurrent];
  };

  get remainingQuestions(){
    return [...this.questionsRemaining];
  };
};