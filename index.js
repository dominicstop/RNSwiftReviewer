import * as Animatable from "react-native-animatable";
import { Navigation } from "react-native-navigation";

import App from 'app/App';

import { RNN_ROUTES } from 'app/src/constants/Routes';

// register RNN components
Navigation.registerComponent(RNN_ROUTES.RootReactNavigationRoute, () => App);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    layout: {
      backgroundColor: 'white',
    },
    animations: {
      setRoot: {
        waitForRender: true,
      },
      showModal: {
        waitForRender: false,
      },
    },
  });
  Navigation.setRoot({
    root: {
      component: {
        name: RNN_ROUTES.RootReactNavigationRoute,
      },
    }
  });
});




// register animations for react-native-animatable
Animatable.initializeRegistryWithDefinitions({
  breathe: {
    0  : { opacity: 1 },
    0.5: { opacity: 0 },
    1  : { opacity: 1 },
  },
  breatheReverse: {
    0  : { opacity: 0 },
    0.5: { opacity: 1 },
    1  : { opacity: 0 },
  },
  zoomInAlt: {
    from: { opacity: 1, transform: [{ scale: 0  }] },
    to  : { opacity: 0, transform: [{ scale: 10 }] },
  },
  fadeScaleOut: {
    from: { 
      opacity: 1, 
      transform: [
        { scaleY    : 1 },
        { translateY: 0 },
      ]
    },
    to: { 
      opacity: 0, 
      transform: [
        { scaleY    : 0.8 },
        { translateY: -90 },
      ]
    },
  },
  fadeScaleIn: {
    from: { 
      opacity: 0, 
      transform: [
        { scaleY    : 0.8 },
        { translateY: -90 },
      ]
    },
    to: { 
      opacity: 1, 
      transform: [
        { scaleY    : 1 },
        { translateY: 0 },
      ]
    },
  },
});