import { IS_DEBUG } from "app/src/constants/Options";
import { QuizSessionKeys, QuizKeys, QuizSectionKeys } from 'app/src/constants/PropKeys';

import * as Helpers from "app/src/functions/helpers";

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

    this.values[QuizSessionKeys.quizID] = quizID;
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