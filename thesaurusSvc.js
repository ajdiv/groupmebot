var requestify = require('requestify'); 

function thesaurize() {
  return requestify.get('https://words.bighugelabs.com/apisample.php?v=2&format=json').then(function(resp) {
  var result = JSON.parse(resp.getBody());  
  return result;
}).catch(function(err) {
  return Promise.reject(err.code + ": An error has occured connecting to the thesaurus.");
});
}

exports.thesaurize = thesaurize;