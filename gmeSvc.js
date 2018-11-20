var request = require('request');

function getLastMessageText(callback) {
  var groupId = process.env.GROUP_ID;
  var accessToken = process.env.ACCESS_TOKEN;
  var url = 'https://api.groupme.com/v3/groups/' + groupId 
  + '/messages' + '?token=' + accessToken;
  request(url, function(error, res){
    if (error) {
      callback(error.code + ": An error has occured connecting to the GroupMe API.");
      return;
    }
    var rawResults = JSON.parse(res.body);  
    var result = rawResults.response.messages[0].text;
    return callback(result);
  });
}

exports.getLastMessageText = getLastMessageText;