import { Navigation } from "react-native-navigation";
import App from './App';

import { ViewQuizModal } from 'app/src/modals/ViewQuizModal';

Navigation.registerComponent(`rootReactNavigationRoute`, () => App          );
Navigation.registerComponent(`RNNModalViewQuiz`        , () => ViewQuizModal);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: "rootReactNavigationRoute"
      }
    }
  });
});
