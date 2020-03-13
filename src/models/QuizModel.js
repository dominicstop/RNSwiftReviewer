import * as Helpers from "app/src/functions/helpers";

import { IS_DEBUG } from "app/src/constants/Options";
import { QuizKeys, SectionKeys } from 'app/src/constants/PropKeys';



// create object with keys and ass. null values
const defaultValues = IS_DEBUG && Helpers.createObjectFromKeys(QuizKeys);

export class QuizModel {
  // default values
  static stucture = {
    quizID           : '',
    quizTitle        : '',
    quizDesc         : '',
    quizSections     : [],
    quizTimesTaken   : 0 ,
    quizDateCreated  : 0 ,
    quizDateLastTaken: 0 ,
    quizQuestionCount: 0 ,
    quizSectionCount : 0 ,
  };

  static wrap(object = QuizModel.stucture){
    return ({
      // helps vscode infer types
      ...(IS_DEBUG && QuizModel.stucture),
      ...(IS_DEBUG && defaultValues     ),
      // pass down object
      ...(object ?? {}),
    });
  };

  constructor(values = {}){
    this.values = {
      ...QuizModel.stucture,
      ...values,
    };
  };

  set title(title = ''){
    this.values[QuizKeys.quizTitle] = title;
  };

  set desc(desc = ''){
    this.values[QuizKeys.quizDesc] = desc;
  };

  setDateCreated(){
    // get timestamp today
    const date = new Date();
    const ts   = date.getTime();

    this.values[QuizKeys.quizDateCreated] = ts;
  };

  setQuizID(){
    const quizTitle = this.values[QuizKeys.quizTitle];
    const quizDesc  = this.values[QuizKeys.quizDesc];
    const tsCreated = this.values[QuizKeys.quizDateCreated];

    const hashCode = Helpers.stringHash(
      (quizTitle + quizDesc)
    );

    this.values[QuizKeys.quizID] = (
      `quiz-${tsCreated}-${hashCode}`
    );

    alert(hashCode);
  };

  addSection(section = {}){
    const quizID      = this.values[QuizKeys.quizID];
    const oldSections = this.values[QuizKeys.quizSections];

    const newSections = [ ...oldSections, {
      ...section,
      //pass down quiz id to section
      [SectionKeys.quizID]: quizID,
    }];

    this.values[QuizKeys.quizSections    ] = newSections;
    this.values[QuizKeys.quizSectionCount] = newSections?.length ?? 0;
  };
};