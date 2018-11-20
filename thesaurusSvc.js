var requestify = require('requestify'); 

function thesaurize(word) {
  var apiKey = process.env.THESAURUS_API_KEY;
  if (!apiKey) throw "Invalid Thesaurus API Key";

  return requestify.get('https://www.dictionaryapi.com/api/v3/references/thesaurus/json/'+ word +'?key=' + apiKey).then(function(resp) {
  var rawResults = JSON.parse(resp.body);  
  var result = rawResults[0].meta.syns[0];
  return result;
}).catch(function(err) {
  return Promise.reject(err.code + ": An error has occured connecting to the thesaurus.");
});
}

exports.thesaurize = thesaurize;