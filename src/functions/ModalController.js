import { Navigation } from 'react-native-navigation';

export const showModalOptionKeys = {
  swipeToDismiss: 'swipeToDismiss',
};

export class ModalController {;  
  static showModal({routeName, options, navProps}){
    //extract options
    const swipeToDismiss = options?.[showModalOptionKeys.swipeToDismiss] ?? true;

    Navigation.showModal({
      component: {
        name: routeName,
        passProps: navProps,
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