var request = require('request');

function thesaurize(phrase, callback) {
  var wordArr = parseSentence(phrase);
  promiseArr = [];

  for(var i = 0; i < wordArr.length;i++){
    var word = wordArr[i];
    var promise = createApiPromise(word);
    promiseArr.push(promise);
  }

  Promise.all(promiseArr).then(function(resultArrays){
    var result = '';
    for(var i = 0; i < resultArrays.length; i++){
      var syn = pickRandomWord(resultArrays[i]);
      result += syn + ' ';
    }
    callback(result);
  });

};

function pickRandomWord(synArr) {
  var result = synArr[Math.floor(Math.random() * synArr.length)];
  return result;
};

function parseSentence(sentence) {
  var arr = sentence.split(' ');
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    var scrub = arr[i].replace(/[^A-Za-z0-9]/g, '');
    result.push(scrub);
  }
  return result;
};

function createApiPromise(word) {
  var apiKey = process.env.THESAURUS_API_KEY;
  var url = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + word + '?key=' + apiKey;
  var promise = new Promise(function(resolve, reject) {
    request({ url: url, rejectUnauthorized: false }, function (error, resp) {
      if (error) {
        reject(error.code + ": An error has occured connecting to the thesaurus: " + error);
      }
      var rawResults = JSON.parse(resp.body);
      var result = '';
      if (!rawResults[0].meta) {
        result = 'Could not find any synonyms for ' + word + '. Did you mean any of the following? \n\n';
        result += JSON.stringify(rawResults);
        resolve(result);
      }
      var result = rawResults[0].meta.syns[0];
      resolve(result);
    });
  });
  return promise;
};

exports.thesaurize = thesaurize;
exports.parseSentence = parseSentence;