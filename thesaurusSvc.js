var request = require('request');

function thesaurize(word, callback) {
  var apiKey = process.env.THESAURUS_API_KEY;
  var url = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + word + '?key=' + apiKey;
  request(url, function (error, resp) {
    if (error) {
      callback(error.code + ": An error has occured connecting to the thesaurus.");
      return;
    }
    var rawResults = JSON.parse(resp.body);
    var result = rawResults[0].meta.syns[0];
    return callback(result);
  });
};

exports.thesaurize = thesaurize;