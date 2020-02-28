import { IS_DEBUG } from "app/src/constants/Options";
import { createObjectFromKeys } from "app/src/functions/helpers";


// property names
export const ExamKeys = {
  examID           : 'examID'           ,
  examTitle        : 'examTitle'        ,
  examDesc         : 'examDesc'         ,
  examTimesTaken   : 'examTimesTaken'   ,
  examDateCreated  : 'examDateCreated'  ,
  examDateLastTaken: 'examDateLastTaken',
  examQuestionCount: 'examQuestionCount',
  examQuizesCount  : 'examQuizesCount'  ,
};

// create object with keys and ass. null values
const defaultValues = IS_DEBUG && createObjectFromKeys(ExamKeys);

export class ExamModel {
  static stucture = {
    examID           : '',
    examTitle        : '',
    examDesc         : '',
    examTimesTaken   : -1,
    examDateCreated  : -1,
    examDateLastTaken: -1,
    examQuestionCount: -1,
    examQuizesCount : -1,
  };

  static wrap(object = ExamModel.stucture){
    return ({
      // helps vscode infer types
      ...(IS_DEBUG && ExamModel.stucture),
      ...(IS_DEBUG && defaultValues     ),
      // pass down object
      ...(object ?? {}),
    });
  };
};