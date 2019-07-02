import request       = require('request');
import Spew              = require('../models/spew.model');

const groupMeUrl  = 'https://api.groupme.com/v3/groups/';

function getLastMessageText(callback) {
  const groupId = process.env.GROUP_ID;
  const accessToken = process.env.ACCESS_TOKEN;
  var url = groupMeUrl + groupId
    + '/messages' + '?token=' + accessToken;
  request(url, function (error, res) {
    if (error) {
      callback(error.code + ": An error has occurred connecting to the GroupMe API.");
      return;
    }
    var rawResults = JSON.parse(res.body);
    var result = rawResults.response.messages[1].text;
    return callback(result);
  });
}

// Tagging everyone requires that the bot receives an "attachment" along w/ its Post request  
// loci is an array of [x,y], where x is the starting location of the text, and y is the @+name.length of the member's name
// Result should be formatted as below:
//[
//   {
//     "loci": [ 
//       [
//         10,
//         8
//       ]
//     ],
//     "type": "mentions",
//     "user_ids": [
//       "12345678"
//     ]
//   }
// ]
function tagEveryone(introText, callback) {
  var groupId = process.env.GROUP_ID;
  const accessToken = process.env.ACCESS_TOKEN;
  var url = groupMeUrl + groupId + '?token=' + accessToken;
  request(url, function (error, res) {
    if (error) {
      callback(error.code + ": An error has occurred connecting to the GroupMe API.");
      return;
    }
    var rawResults = JSON.parse(res.body);
    var memberRes = getAllMembers(introText, rawResults.response.members);
    var result = {
      text: memberRes.text,
      attachments: [{
        "type": "mentions",
        "user_ids": memberRes.attachment.user_ids,
        "loci": memberRes.attachment.loci
      }]
    }
    return callback(result);
  });
}

function addSpew(userId, callback) {
  var gmeUserId = parseInt(userId);
  Spew.findOne({ gmeUserId: gmeUserId }).then(result => {
    let spew;
    if (!result) {
      spew = new Spew({
        gmeUserId: gmeUserId,
        spewCount: 1,
        spewDate: new Date()
      });
    } else {
      spew = result;
      spew.spewCount++;      
    }
    return spew.save().then((res) => {
      var word = res.spewCount === 1 ? 'time' : 'times';
      return callback(`You spewed ${res.spewCount} ${word}`);
    });
  });
}

function getAllMembers(introText, members) {
  var lociIndex = introText.length; // This corresponds to the first "x" in the loci
  var results = {
    text: introText,
    attachment: {
      user_ids: [],
      loci: []
    }
  };
  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    var name = member.nickname;
    var loci = [lociIndex, name.length + 1] //name.length + 1 to account for the "@"
    if (i == 0) {
      results.text += '@' + name;
    } else {
      results.text += ' @' + name;
    }
    lociIndex = results.text.length + 1; //to account for the space
    results.attachment.user_ids.push(member.user_id);
    results.attachment.loci.push(loci);
  }
  return results;
}

export = {
  getLastMessageText: getLastMessageText,
  tagEveryone: tagEveryone,
  addSpew: addSpew
};