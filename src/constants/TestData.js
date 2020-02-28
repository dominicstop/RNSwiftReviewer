import { QuizModel } from "app/src/models/QuizModel";
import { ExamModel } from "app/src/models/ExamModel";

//#region - Quiz
export const TestDataQuiz = {
  'quizID-0': QuizModel.wrap({
    quizID           : 'quizID-0',
    quizTitle        : 'Test Quiz A',
    quizDesc         : '2 Sentences: Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.',
    quizDateCreated  : 1580112192,
    quizDateLastTaken: 1582790625,
    quizQuestionCount: 100,
    quizSectionCount : 10,
    quizTimesTaken   : 5,
  }),
  'quizID-1': QuizModel.wrap({
    quizID           : 'quizID-1',
    quizTitle        : 'Test Quiz B - Lorum Ipsum',
    quizDesc         : '1 sentence: Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
    quizDateCreated  : 1564214625,
    quizDateLastTaken: 1577433825,
    quizQuestionCount: 25,
    quizSectionCount : 1,
    quizTimesTaken   : 1,
  }),
  'quizID-2': QuizModel.wrap({
    quizID           : 'quizID-2',
    quizTitle        : 'Test Quiz C - Long Title Lorum Ipsum',
    quizDesc         : '3 sentence: Maecenas sed diam eget risus varius blandit sit amet non magna. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Maecenas faucibus mollis interdum.',
    quizDateCreated  : 1577520225,
    quizDateLastTaken: 1578038625,
    quizQuestionCount: 75,
    quizSectionCount : 3,
    quizTimesTaken   : 10,
  }),
  'quizID-3': QuizModel.wrap({
    quizID           : 'quizID-3',
    quizTitle        : 'Test Quiz D - 12, 13/14',
    quizDesc         : '3 sentence: Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla. Donec id elit non mi porta gravida at eget metus.',
    quizDateCreated  : 1553673825,
    quizDateLastTaken: null,
    quizQuestionCount: 50,
    quizSectionCount : 2,
    quizTimesTaken   : 0,
  }),
};
//#endregion

//#region - Exam
export const TestDataExam = {
  'examID-0': ExamModel.wrap({
    examID           : 'examID-0',
    examTitle        : 'Test exam A',
    examDesc         : '2 Sentences: Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.',
    examDateCreated  : 1580112192,
    examDateLastTaken: 1582790625,
    examQuestionCount: 100,
    examQuizCount : 10,
    examTimesTaken   : 5,
  }),
  'examID-1': ExamModel.wrap({
    examID           : 'examID-1',
    examTitle        : 'Test exam B - Lorum Ipsum',
    examDesc         : '1 sentence: Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
    examDateCreated  : 1564214625,
    examDateLastTaken: 1577433825,
    examQuestionCount: 25,
    examQuizCount : 1,
    examTimesTaken   : 1,
  }),
  'examID-2': ExamModel.wrap({
    examID           : 'examID-2',
    examTitle        : 'Test exam C - Long Title Lorum Ipsum',
    examDesc         : '3 sentence: Maecenas sed diam eget risus varius blandit sit amet non magna. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Maecenas faucibus mollis interdum.',
    examDateCreated  : 1577520225,
    examDateLastTaken: 1578038625,
    examQuestionCount: 75,
    examQuizCount : 3,
    examTimesTaken   : 10,
  }),
  'examID-3': ExamModel.wrap({
    examID           : 'examID-3',
    examTitle        : 'Test exam D - 12, 13/14',
    examDesc         : '3 sentence: Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla. Donec id elit non mi porta gravida at eget metus.',
    examDateCreated  : 1553673825,
    examDateLastTaken: null,
    examQuestionCount: 50,
    examQuizCount : 2,
    examTimesTaken   : 0,
  }),
};//#endregion