const key = 's:tèe†oüƒ,DJY∫üs∆9KwU47tpèu…[%h¢>aèvDPøq)ƒu+i&»¿6NbèƒºktCVLs¬z;|MxMuj¶l8^bL$X°µx≥∑π≥¬Jø^ª≈èÇè0…@!zMB'

const stringToArray = (string) => {
  return string.split("");
}

const letterToValue = (array) => {
  var newArray = array.slice();
  for(let i = 0; i < array.length; i++){
    newArray[i] = getLetterValue(array[i]);
  }
  return newArray;
}

const getLetterValue = (letter) => {
  return(letterValue.indexOf(letter));
}

const letterValue = [
  'a','+','*','ç','e','f','g','h','i','j',
  'k','l','∑','€','®','p','q','r','s','t',
  'u','v','w','x','y','z',' ','A','B','C',
  'D',';','.',':','I','J','K','L','M','?',
  'N','O','P','Q','R','S','T','U','V','W',
  'X','Y','Z',',','E','F','G','H','-','"',
  '!',"'",'_','b','c','d','%','&','/','1',
  ')','=','è','ü','é','ö','à','ä','$','£',
  '@','œ','m','n','o','(','2','3','4','5',
  '6','7','8','9','0','<','>','^','`','°',
  '§','\\','[',']','±','“','”','#','Ç','|',
  '≠','¿','´','†','Ω','°','¡','ø','π','å',
  'ß','∂','ƒ','@','ª','º','∆','¬','¢','æ',
  '¶','≤','≥','¥','≈','©','√','∫','~','µ',
  '«','»','…','â'
];

const crypt = {
  keyCypher: (string) => {
    var array = stringToArray(string);
    var firstValues = letterToValue(array);
    var keyValues = letterToValue(stringToArray(key));
    var secondValues = firstValues.slice();
    var value;
    var newValue;
    var nextKeyIndex = 0;
    for(let i = 0; i < array.length; i++) {
      value = firstValues[i];
      newValue = value + keyValues[nextKeyIndex];
      nextKeyIndex++;
      if(nextKeyIndex >= keyValues.length) {
        nextKeyIndex = 0;
      }
      if(newValue >= letterValue.length){
        newValue = newValue - letterValue.length;
      }
      secondValues[i] = letterValue[newValue];
    }
    return secondValues.join("");
  },
  keyCypherDecryption: (string) => {
    var array = stringToArray(string);
    var firstValues = letterToValue(array);
    var keyValues = letterToValue(stringToArray(key));
    var secondValues = firstValues.slice();
    var value;
    var newValue;
    var nextKeyIndex = 0;
    for(let i = 0; i < array.length; i++) {
      value = firstValues[i];
      newValue = value - keyValues[nextKeyIndex];
      nextKeyIndex++;
      if(nextKeyIndex >= keyValues.length) {
        nextKeyIndex = 0;
      }
      if(newValue < 0){
        newValue = newValue + letterValue.length;
      }
      secondValues[i] = letterValue[newValue];
    }
    return secondValues.join("");
  },
}

console.log("cryptage.js loaded.");
export {crypt}
