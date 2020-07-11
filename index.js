import App from 'app/App';
import { AppRegistry } from 'react-native';
import { name as appName } from 'app/app.json';

import * as Animatable from "react-native-animatable";


AppRegistry.registerComponent(appName, () => App);

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