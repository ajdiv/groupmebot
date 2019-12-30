import request = require('request');
import textUtils = require('../utilities/textUtilities');

async function thesaurize(phrase: string): Promise<string> {
  let wordArr = parseSentence(phrase);
  let promiseArr = [];

  for(var i = 0; i < wordArr.length;i++){
    let word = wordArr[i];
    console.log("Word: " + word);
    let promise = createApiPromise(word);
    promiseArr.push(promise);
  }

  const resultArrays: any[] = await Promise.all(promiseArr);
  let result = '';
  for (var i_1 = 0; i_1 < resultArrays.length; i_1++) {
    let syn = textUtils.pickRandomWord(resultArrays[i_1]);
    result += syn + ' ';
  }
  return Promise.resolve(result.trim());

};

function parseSentence(sentence: string) {
  var arr = sentence.split(' ');
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    var scrub = arr[i].replace(/[^A-Za-z0-9]/g, '');
    result.push(scrub);
  }
  return result;
};

function createApiPromise(word: string) {
  if(checkWordBlacklisted(word)){
    return Promise.resolve([word]);
  }

  var apiKey = process.env.THESAURUS_API_KEY;
  var url = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + word + '?key=' + apiKey;
  var promise = new Promise(function(resolve, reject) {
    request({ url: url, rejectUnauthorized: false }, function (error, resp) {
      if (error) {
        reject(error.code + ": An error has occurred connecting to the thesaurus: " + error);
      }
      var rawResults = JSON.parse(resp.body);
      var result = '';
      if (!rawResults[0].meta && Object.prototype.toString.call(rawResults) === '[object Array]') {
        result = textUtils.pickRandomWord(rawResults);
        return resolve([result]);
      }
      if(!rawResults[0] || !rawResults[0].meta || !rawResults[0].meta.syns) {
        return resolve([word]);
      }
      result = rawResults[0].meta.syns[0];
      resolve(result);
    });
  });
  return promise;
};

function checkWordBlacklisted(word: string){
  // These must all be lowercase
  var blackListArr = [
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"
  ];

  if(!word || !word[0]) return true;

  var isCommonWord = blackListArr.includes(word);
  var isProperNoun = word[0] === word[0].toUpperCase();

  return isCommonWord || isProperNoun;
}

export = {
  thesaurize : thesaurize
}