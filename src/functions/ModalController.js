import { Navigation } from 'react-native-navigation';
import { RNN_ROUTES } from 'app/src/constants/Routes';

export const showModalOptionKeys = {
  swipeToDismiss: 'swipeToDismiss',
};

export class ModalController {;  
  static showModal(options = {}){
    //extract options
    const swipeToDismiss = options[showModalOptionKeys.swipeToDismiss] ?? true;

    Navigation.showModal({
      component: { 
        name: RNN_ROUTES.RNNModalViewQuiz,
        options: {
          modalPresentationStyle: 'pageSheet',
          modal: { swipeToDismiss },
          layout: {
            backgroundColor: 'transparent',
          },
        },
      },
    });
  };
};