import { NativeModules } from 'react-native';

const moduleName   = "ModalViewModule";
const NativeModule = NativeModules[moduleName];

const COMMAND_KEYS = {
  dismissModalByID: 'dismissModalByID'
};


export class ModalViewModule {
  static dismissModalByID(modalID = ''){
    return new Promise((resolve, reject) => {
      NativeModule[COMMAND_KEYS.dismissModalByID](modalID, success => {
        console.log(`ModalViewModule, dismissModalByID: ${success}`);
        (success? resolve : reject)();
      });
    });
  };
};