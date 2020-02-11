import { Navigation } from "react-native-navigation";
import App from './App';

import { ViewQuizModal } from 'app/src/modals/ViewQuizModal';

import { RNN_ROUTES } from 'app/src/constants/Routes';

Navigation.registerComponent(RNN_ROUTES.RootReactNavigationRoute, () => App          );
Navigation.registerComponent(RNN_ROUTES.RNNModalViewQuiz        , () => ViewQuizModal);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: RNN_ROUTES.RootReactNavigationRoute,
      },
    }
  });
});
