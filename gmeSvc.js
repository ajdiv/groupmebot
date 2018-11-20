var requestify = require('requestify'); 

function getLastMessageText() {
  var groupId = process.env.GROUP_ID;
  var accessToken = process.env.ACCESS_TOKEN;
  var url = 'https://api.groupme.com/v3/groups/' + groupId 
  + '/messages' + '?token=' + accessToken;
  return requestify.get(url).then(function(res){
    var rawResults = JSON.parse(res.body);  
    return rawResults.response.messages[0].text;
  }).catch(function(err) {
    return Promise.reject(err.code + ": An error has occured connecting GroupMe API.");
  });
}

exports.getLastMessageText = getLastMessageText;