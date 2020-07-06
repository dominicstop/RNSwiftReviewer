import { Alert, ActionSheetIOS } from 'react-native';
import deviceSize from 'react-native-device-size';
import _ from 'lodash';

//wrapper func for setstate that returns a promise
export function setStateAsync(that, newState) {
  return new Promise((resolve) => {
      that.setState(newState, () => {
          resolve();
      });
  });
};

//wrapper for timeout that returns a promise
export function timeout(ms) {
  return new Promise(resolve => {
    const timeoutID = setTimeout(() => {
      clearTimeout(timeoutID);
      resolve();
    }, ms)
  });
};

export function promiseWithTimeout(ms, promise){
  // Create a promise that rejects in <ms> milliseconds
  const timeoutPromise = new Promise((resolve, reject) => {
    const timeoutID = setTimeout(() => {
      clearTimeout(timeoutID);
      reject(`Promise timed out in ${ms} ms.`)
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeoutPromise]);
};

//returns a shuffled an array
export function shuffleArray(array = []) {
  var newArray = _.cloneDeep(array);

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  };

  return(newArray);
};

//pick a random item from an array
export function randomElementFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
};

//when i exceeds max, go back to zero
export function returnToZero(i, max){
  let mod = i % (max + 1);
  return i <= max? i : mod;
};

export function plural(string = "", count = 0, suffix = 's'){
  return string + ((count > 1 || count == 0)? suffix : '');
};

/** returns undefined when index is invalid */
export function getLast(array) {
  return array[array.length - 1];
};

/** returns undefined when index is invalid */
export function getFirst(array) {
  return array[0];
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function getLetter(index = 0){
  return alphabet[index];
};

export function isValidTimestamp(timestamp){
  return (new Date(timestamp)).getTime() > 0;
};

export function isStringEmpty(string){
  const text = string || '';
  return (text.length == 0) || (text == '');
};

export function hexToRGBA(hex, opacity){
  let c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    };
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + opacity + ')';
  };
  throw new Error('Bad Hex');
};

const isDataUrlRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
export function isDataURL(s) {
  return !!s.match(isDataUrlRegex);
};

/** returns null if not valid */
export function getBase64MimeType(encoded = '') {
  if (typeof encoded !== 'string') return null;
  const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mime && mime.length) {
    return mime[1];
  };
};

const imageMimeTypes = ['image/png', 'image/jpeg'];
export function isMimeTypeImage(type){
  return imageMimeTypes.includes(type)
};

export function isBase64Image(photouri){
  //check if uri is valid base64
  const isBase64 = isDataURL(photouri);
  //check if uri is an image
  const type    = getBase64MimeType(photouri);
  const isImage = isMimeTypeImage(type);
  //check if uri is a valid base64image
  return(isBase64 && isImage);
};

export function addLeadingZero(number){
  return number < 10? `0${number}`: number;
};

export function formatPercent(percent){
  const isWhole = (percent % 1 === 0);
  const formatted = isWhole? percent : percent.toFixed(2);
  return(`${formatted}%`);
};

export function replacePropertiesWithNull(obj = {}){
  //make a copy of the object
  let new_obj = _.cloneDeep(obj);
  //get an array of all the property names
  const keys = Object.keys(obj);
  //replace all the properties with null
  keys.forEach((property) => {
    new_obj[property] = null;
  });
  return(new_obj);
};

export function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  });
};

export async function randomDelay(min, max) {
  const delay = Math.random() * (max - min) + min
  const startTime = performance.now()

  while (performance.now() - startTime < delay) {
    await nextFrame()
  };
};

export function asyncAlert({title, desc}){
  return new Promise(resolve => Alert.alert(
    title, desc,
    [{text: 'OK', onPress: () => resolve()}],
  ));
};

export function asyncAlertInput({
  title  = ''  ,
  desc   = ''  , 
  value  = ''  , 
  okText = 'Ok',
}){
  return new Promise((resolve, reject) => 
    Alert.prompt(title, desc, [
      { text: 'Cancel', style: "cancel", onPress: ()     => reject ()     },
      { text: okText  , style: null    , onPress: (text) => resolve(text) },
    ], "plain-text", value, 'ascii-capable')
  );
};

export function asyncActionSheetConfirm({title, message, confirmText, isDestructive = false}){
  return new Promise(resolve => {
    ActionSheetIOS.showActionSheetWithOptions({
      title, message,
      options: ['Cancel', confirmText],
      cancelButtonIndex: 0,
      ...(isDestructive && {
        destructiveButtonIndex: 1,
      }),
    }, (buttonIndex) => {
      resolve((buttonIndex === 1));
    });
  });
};

export function asyncMeasure(ref){
  return new Promise(resolve => {
    ref.measure((x, y, width, height, px, py) => {
      resolve({x, y, width, height, px, py});
    });
  });
};

export function countOccurences(item = '', items = []){
  return items.filter(i => i === item).length;
};

//returns undefined if property does not exist
export function getProperty(obj, key) {
  return key.split(".").reduce((o, x) => 
    ((typeof o == "undefined" || o === null)? o : o[x]), obj
  );
};


export function capitalize(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function convertHoursToMS(hours){
  const minutes = hours   * 60;
  const seconds = minutes * 60;
  return (seconds * 1000);
};

export function formatMsToDuration(mills) {
  const seconds = Math.floor(mills   / 1000);
  const minutes = Math.floor(seconds / 60  );
  const hours   = Math.floor(minutes / 60  );

  const modSec = (seconds % 60);
  const modMin = (minutes % 60);

  const pad = (num) => ("0"+num).slice(-2);
  return `${pad(hours)}:${pad(modMin)}:${pad(modSec)}`
};

export function lerp(a, b, n) {
  return (1 - n) * a + n * b;
};

export function createObjectFromKeys(keys = {}){
  let newObject = {};

  const propKeys = Object.keys(keys);
  propKeys.forEach(key =>  {
    newObject[key] = null;
  });

  return newObject;
};

export function sizeSelectVerbose({xsmall, small, normal, large, xlarge}){
  switch (deviceSize) {
    case 'xsmall': return xsmall;
    case 'small' : return small ;
    case 'normal': return normal;
    case 'large' : return large ;
    case 'xlarge': return xlarge;
  };
};

export function sizeSelectSimple({normal, large}){
  switch (deviceSize) {
    case 'xsmall':
    case 'small' :
    case 'normal': return normal;
    case 'large' :
    case 'xlarge': return large;
  };
};

export function stringHash(string = '') {
  let length = string?.length ?? 0;
  let hash = 0, char;

  if (length === 0) return hash;

  while (length--) {
    char = string.charCodeAt(length);
    hash = ((hash << 5) - hash) + char;
    // Convert to 32bit integer
    hash |= 0; 
  };

  return hash;
};

export function roundToTwo(num){
  return Math.round((num + Number.EPSILON) * 100) / 100;
};