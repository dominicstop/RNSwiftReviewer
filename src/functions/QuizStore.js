import AsyncStorage from '@react-native-community/async-storage';

let cache = [];
let index = 0;


export class QuizStore {
  static KEY = '@quiz';

  static updateCache(newCache){
    cache = newCache;
    index++;
  };

  static getCache(){
    return {
      index,
      quizes: cache,
    };
  };

  static async getQuizes(){
    try {
      // get stored quizes
      const value = await AsyncStorage.getItem(QuizStore.KEY);

      // nothing stored yet
      if(value == null) return {
        success: true,
        quizes: [], 
        index,
      };

      // parse string as json
      const quizes = await JSON.parse(value) ?? [];
      QuizStore.updateCache(quizes);

      return {
        success: true,
        quizes, index
      };
      
    } catch(error){
      console.log('Error: QuizStore - getQuizes failed!');
      console.log(error);

      return {
        success: false,
        quizes : [],
        index,
      };
    };
  };

  static async insertQuiz(quiz = {}){
    try {
      //get stored quizes
      const prevQuizes = await QuizStore.getQuizes();

      if(!prevQuizes.success){
        throw ("QuizStore.getQuizes failed.");
      };

      //add new quiz to prev quizes
      const newQuizes = [ ...prevQuizes.quizes, quiz ];
      await AsyncStorage.setItem(QuizStore.KEY, 
        JSON.stringify(newQuizes)
      );

      // update quiz cache
      QuizStore.updateCache(newQuizes);

      return { 
        success: true,
        index,
      };

    } catch(error){
      console.log('Error: QuizStore - insertQuiz failed!');
      console.log(error);

      return { 
        success: false,
        index,
      };
    };
  };

  static async clearQuizes(){
    await AsyncStorage.removeItem(QuizStore.KEY);
  };
};