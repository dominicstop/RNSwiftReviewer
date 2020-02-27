import { IS_DEBUG } from "app/src/constants/Options";
import { createObjectFromKeys } from "app/src/functions/helpers";


// property names
export const QuizKeys = {
  quizID           : 'quizID'           ,
  quizTitle        : 'quizTitle'        ,
  quizDesc         : 'quizDesc'         ,
  quizTimesTaken   : 'quizTimesTaken'   ,
  quizDateCreated  : 'quizDateCreated'  ,
  quizDateLastTaken: 'quizDateCreated'  ,
  quizQuestionCount: 'quizQuestionCount',
  quizSectionCount : 'quizSectionCount' ,
};

// create object with keys and ass. null values
const defaultValues = IS_DEBUG && createObjectFromKeys(QuizKeys);

export class QuizModel {
  static stucture = {
    quizID           : '',
    quizTitle        : '',
    quizDesc         : '',
    quizTimesTaken   : -1,
    quizDateCreated  : -1,
    quizDateLastTaken: -1,
    quizQuestionCount: -1,
    quizSectionCount : -1,
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
};