import request = require('request');
import textUtils = require('../utilities/textUtilities');

export async function thesaurize(phrase: string): Promise<string> {
  // Collect one promise (thesaurus request) per non-trivial word in the phrase
  const wordArr = textUtils.parseAndScrub(phrase);
  const promiseArr = [];

  for (let i = 0; i < wordArr.length; i++) {
    const word = wordArr[i];
    const promise = createApiPromise(word);
    promiseArr.push(promise);
  }

  const resultArrays: any[] = await Promise.all(promiseArr);
  let result = '';
  for (let i = 0; i < resultArrays.length; i++) {
    let syn = textUtils.pickRandomWord(resultArrays[i]);
    result += syn + ' ';
  }
  return Promise.resolve(result.trim());
};

function createApiPromise(word: string) {
  if (!textUtils.wordCanSynonym(word)) {
    return Promise.resolve([word]);
  }

  var apiKey = process.env.THESAURUS_API_KEY;
  var url = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + word + '?key=' + apiKey;
  var promise = new Promise(function (resolve, reject) {
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
      if (!rawResults[0] || !rawResults[0].meta || !rawResults[0].meta.syns) {
        return resolve([word]);
      }
      result = rawResults[0].meta.syns[0];
      resolve(result);
    });
  });
  return promise;
};

