import { IS_DEBUG } from "app/src/constants/Options";
import { createObjectFromKeys } from "app/src/functions/helpers";


// property names for quiz
export const QuizKeys = {
  quizID           : 'quizID'           ,
  quizTitle        : 'quizTitle'        ,
  quizDesc         : 'quizDesc'         ,
  quizSections     : 'quizSections'     ,
  quizTimesTaken   : 'quizTimesTaken'   ,
  quizDateCreated  : 'quizDateCreated'  ,
  quizDateLastTaken: 'quizDateLastTaken',
  quizQuestionCount: 'quizQuestionCount',
  quizSectionCount : 'quizSectionCount' ,
};

// create object with keys and ass. null values
const defaultValues = IS_DEBUG && createObjectFromKeys(QuizKeys);

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

  addSection(section = {}){
    const oldSections = this.values[QuizKeys.quizSections];
    const newSections = [ ...oldSections,  section ];

    this.values[QuizKeys.quizSections    ] = newSections;
    this.values[QuizKeys.quizSectionCount] = newSections?.length ?? 0;
  };
};