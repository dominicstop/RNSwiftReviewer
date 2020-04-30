import { IS_DEBUG } from "app/src/constants/Options";
import { QuizSessionKeys, QuizKeys, QuizSectionKeys, QuizQuestionKeys } from 'app/src/constants/PropKeys';
import { SectionTypes } from "app/src/constants/SectionTypes";

import isEmpty from 'lodash/isEmpty';
import * as Helpers from "app/src/functions/helpers";
import { QuizSessionResultModel } from "./QuizSessionResultsModel";


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
    let   copy = QuizSessionModel.wrap({});
    const keys = Object.keys(QuizSessionKeys);

    for (const key of keys) {
      copy[key] = values[key];
    };

    return copy;
  };

  constructor(values = {}){
    this.values = QuizSessionModel.wrap(values);

    this.questions = [];
    this.results = new QuizSessionResultModel();
  };

  initFromQuiz(quiz = {}){
    this.setStartDate();

    const quizID   = quiz[QuizKeys.quizID];
    const sections = quiz[QuizKeys.quizSections];

    const startDate = this.values[QuizSessionKeys.sessionDateStart];

    const sessionID = (
      `session-(quizID:${quizID})-(startDate:${startDate})`
    );

    this.questions =
      extractQuestionsFromSections(sections);

    const matchingTypeChoices =
      extractMatchingTypeChoicesFromSections(sections);

    this.values[QuizSessionKeys.quizID   ] = quizID;
    this.values[QuizSessionKeys.sessionID] = sessionID;
    this.values[QuizSessionKeys.matchingTypeChoices] = matchingTypeChoices;
  };

  set quizID(id = ''){
    this.values[QuizSessionKeys.quizID] = id;
  };

  set sessionID(id = ''){
    this.values[QuizSessionKeys.sessionID] = id;
  };

  set answers(answerMap = {}){
    this.values[QuizSessionKeys.sessionAnswers] =
      { ...answerMap };
  };

  setStartDate(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[QuizSessionKeys.sessionDateStart] = ts;
  };

  setEndDate(){
    const start = this.values[QuizSessionKeys.sessionDateStart];

    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    const duration = (ts - start);
    
    this.values[QuizSessionKeys.sessionDateEnd ] = ts;
    this.values[QuizSessionKeys.sessionDuration] = duration;
  };

  initResults(){
    this.results.setQuestions(this.questions);
    this.results.initFromSession(this.values);
    this.results.processResults();

    const score   = this.results.score;
    const results = this.results.results;

    this.values[QuizSessionKeys.sessionScore  ] = { ...score };
    this.values[QuizSessionKeys.sessionResults] = [ ...results ];
  };
};