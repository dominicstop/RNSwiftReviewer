import * as Animatable from "react-native-animatable";
import { Navigation } from "react-native-navigation";

import App from 'app/App';

import { ViewQuizModal       } from 'app/src/modals/ViewQuizModal';
import { CreateQuizModal     } from "app/src/modals/CreateQuizModal";
import { QuizAddSectionModal } from "app/src/modals/QuizAddSectionModal";

import { RNN_ROUTES } from 'app/src/constants/Routes';


// register RNN components
Navigation.registerComponent(RNN_ROUTES.RootReactNavigationRoute, () => App                );
Navigation.registerComponent(RNN_ROUTES.RNNModalViewQuiz        , () => ViewQuizModal      );
Navigation.registerComponent(RNN_ROUTES.RNNModalCreateQuiz      , () => CreateQuizModal    );
Navigation.registerComponent(RNN_ROUTES.RNNModalQuizAddSection  , () => QuizAddSectionModal);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: RNN_ROUTES.RootReactNavigationRoute,
      },
    }
  });
});

Animatable.initializeRegistryWithDefinitions({
  breathe: {
    0  : { opacity: 0 },
    0.5: { opacity: 1 },
    1  : { opacity: 0 },
  }
});
