import * as Helpers from "app/src/functions/helpers";

import { IS_DEBUG } from "app/src/constants/Options";
import { QuizKeys, QuizSectionKeys } from 'app/src/constants/PropKeys';



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
      `quiz-ts:${tsCreated}-hash:${hashCode}`
    );
  };

  setQuestionCount(){
    const sections = this.values[QuizKeys.quizSections] ?? [];

    let questionCount = 0;
    sections.forEach(section => {
      const questions = section[QuizSectionKeys.sectionQuestions] ?? [];
      questions.forEach(question => {
        questionCount++;
      });
    });

    this.values[QuizKeys.quizQuestionCount] = questionCount;
  };

  addSection(section = {}){
    const quizID      = this.values[QuizKeys.quizID];
    const oldSections = this.values[QuizKeys.quizSections];

    const newSections = [ ...oldSections, {
      ...section,
      //pass down quiz id to section
      [QuizSectionKeys.quizID]: quizID,
    }];

    this.values[QuizKeys.quizSections    ] = newSections;
    this.values[QuizKeys.quizSectionCount] = newSections?.length ?? 0;

    this.setQuestionCount();
  };

  updateSection(updatedSection = {}, updateQuestions = false){
    // create copy of sections
    const sectionsCopy = [
      ...(this.values[QuizKeys.quizSections] ?? [])
    ];

    const updatedSectionID = updatedSection[QuizSectionKeys.sectionID];

    for (let index = 0; index < sectionsCopy.length; index++) {
      const section   = sectionsCopy[index];
      const sectionID = section[QuizSectionKeys.sectionID];
      
      if(updatedSectionID == sectionID){
        sectionsCopy[index] = { ...section,
          // pass down updated section values, excluding id/date created etc.
          [QuizSectionKeys.sectionTitle]: updatedSection[QuizSectionKeys.sectionTitle],
          [QuizSectionKeys.sectionDesc ]: updatedSection[QuizSectionKeys.sectionDesc ],
          [QuizSectionKeys.sectionType ]: updatedSection[QuizSectionKeys.sectionType ],
          ...(updateQuestions && {
            [QuizSectionKeys.sectionQuestions    ]: updatedSection[QuizSectionKeys.sectionQuestions    ],
            [QuizSectionKeys.sectionQuestionCount]: updatedSection[QuizSectionKeys.sectionQuestionCount],
          })
        };
      };
    };

    // assign changes made from copy
    this.values[QuizKeys.quizSections     ] = sectionsCopy;
    this.values[QuizKeys.quizSectionCount ] = sectionsCopy.length;
    // update question count
    this.setQuestionCount();
  };

  deleteSection(deletedSection){
    const deletedID = deletedSection[QuizSectionKeys.sectionID];
    const sections  = this.values[QuizKeys.quizSections] ?? [];
    
    const sectionsUpdated = sections.filter((section, index) => {
      const sectionID = section[QuizSectionKeys.sectionID];
      return (sectionID != deletedID);
    });
    
    // count sections
    const sectionCount = sectionsUpdated?.length ?? 0;

    console.log(`Prev Count: ${this.values[QuizKeys.quizSectionCount]}`);
    console.log(`Next Count: ${sectionCount}`);

    // assign changes made
    this.values[QuizKeys.quizSections    ] = sectionsUpdated;
    this.values[QuizKeys.quizSectionCount] = sectionCount;
  };
};