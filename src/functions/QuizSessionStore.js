import AsyncStorage from '@react-native-community/async-storage';
import { QuizSessionKeys } from 'app/src/constants/PropKeys';


let cache = [];
let index = 0;


export class QuizSessionStore {
  static KEY = '@quiz-sessions';

  static updateCache(newCache){
    cache = newCache;
    index++;
  };

  static getCache(){
    return {
      index,
      sessions: cache,
    };
  };

  static async getSessions(){
    try {
      // get stored sessions
      const value = await AsyncStorage.getItem(QuizSessionStore.KEY);

      // nothing stored yet
      if(value == null) return {
        success: true,
        sessions: [], 
        index,
      };

      // parse string as json
      const sessions = await JSON.parse(value) ?? [];
      QuizSessionStore.updateCache(sessions);

      return {
        success: true,
        sessions, index
      };
      
    } catch(error){
      console.log('Error: QuizSessionStore - getSession failed!');
      console.log(error);

      return {
        success : false,
        sessions: [],
        index,
      };
    };
  };

  static async insertSession(session = {}){
    try {
      //get stored sessions
      const prevSessions = await QuizSessionStore.getSessions();

      if(!prevSessions.success){
        throw ("QuizSessionStore.getSessions failed.");
      };

      //add new session to prev sessions
      const newSessions = [...prevSessions.sessions, session];
      await AsyncStorage.setItem(QuizSessionStore.KEY, 
        JSON.stringify(newSessions)
      );

      // update session cache
      QuizSessionStore.updateCache(newSessions);

      return { 
        success: true,
        index,
      };

    } catch(error){
      console.log('Error: QuizSessionStore - insertSession failed!');
      console.log(error);

      return { 
        success: false,
        index,
      };
    };
  };

  static async setSessions(sessions = []){
    try {
      // save quiz
      await AsyncStorage.setItem(QuizSessionStore.KEY, 
        JSON.stringify(sessions)
      );

      // update quiz cache
      QuizSessionStore.updateCache(sessions);

      return { 
        index,
        success: true,
      };
      
    } catch (error) {
      console.log('Error: QuizSessionStore - setSessions failed!');
      console.log(error);

      return { 
        success: false,
        index,
      };
    };
  };

  static async clearSessions(){
    await AsyncStorage.removeItem(QuizSessionStore.KEY);
  };
};