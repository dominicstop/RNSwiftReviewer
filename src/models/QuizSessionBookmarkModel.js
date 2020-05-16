import { QuizSessionBookmarkKeys } from 'app/src/constants/PropKeys';
import * as Helpers from "app/src/functions/helpers";


export class QuizSessionBookmarkModel {
  constructor(props){
    this.bookmarkMap = {};
  };

  setBookmarks(bookmarks){
    if(bookmarks){
      this.bookmarkMap = { 
        ...bookmarks
      };
    };
  };

  addBookmark(questionID){
    const isIDValid = (
      (questionID != null     ) ||
      (questionID != undefined) ||
      (!Helpers.isStringEmpty(questionID))
    );
    
    if(!isIDValid) throw 'Invalid questionID';

    this.bookmarkMap[questionID] = {
      [QuizSessionBookmarkKeys.questionID]: questionID,
    };
  };

  removeBookmark(questionID){
    const isIDValid = (
      (questionID != null     ) ||
      (questionID != undefined) ||
      (!Helpers.isStringEmpty(questionID))
    );

    if(!isIDValid) throw 'Invalid questionID';

    delete this.bookmarkMap[questionID]; 
  };
};