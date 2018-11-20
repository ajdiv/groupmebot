var request = require('request');

function thesaurize(word, callback) {
  var apiKey = process.env.THESAURUS_API_KEY;
  var url = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + word + '?key=' + apiKey;
  request({ url: url, rejectUnauthorized: false }, function (error, resp) {
    if (error) {
      callback(error.code + ": An error has occured connecting to the thesaurus: " + error);
      return;
    }
    var rawResults = JSON.parse(resp.body);
    var result = '';
    if(!rawResults[0].meta){
      result = 'Could not find any synonyms for ' + word +'. Did you mean any of the following? \n\n';
      result += JSON.stringify(rawResults);
      return callback(result);
    }
    var result = rawResults[0].meta.syns[0];
    return callback(result);
  });
};

exports.thesaurize = thesaurize;