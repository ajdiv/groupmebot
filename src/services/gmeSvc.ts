import request = require('request-promise');
import Spew = require('../models/SpewModel');

const groupMeUrl = 'https://api.groupme.com/v3/groups/';

function getLastMessageText(): Promise<string> {
  const groupId = process.env.GROUP_ID;
  const accessToken = process.env.ACCESS_TOKEN;
  var url = groupMeUrl + groupId
    + '/messages' + '?token=' + accessToken;
  return request(url).then((res: any) => {
    var rawResults = JSON.parse(res);
    var result = rawResults.response.messages[1].text;
    return Promise.resolve(result);
  }).catch((error: any) => {
    return Promise.reject(error.code + ": An error has occurred connecting to the GroupMe API.")
  });
}

function addSpew(userId: number): Promise<string> {
  return Spew.findOne({ gmeUserId: userId }).then(result => {
    let spew;
    if (!result) {
      spew = new Spew({
        gmeUserId: userId,
        spewCount: 1,
        spewDate: new Date()
      });
    } else {
      spew = result;
      spew.spewCount++;
    }
    return spew.save().then((res) => {
      var word = res.spewCount === 1 ? 'time' : 'times';
      return Promise.resolve(`You spewed ${res.spewCount} ${word}`);
    });
  });
}

function getAllUsersInCurrentGroup(): Promise<any[]> {
  var groupId = process.env.GROUP_ID;
  const accessToken = process.env.ACCESS_TOKEN;
  var url = groupMeUrl + groupId + '?token=' + accessToken;
  return request(url).then(resStr => {
    var resJson = JSON.parse(resStr);
    return resJson.response.members;
  });
}

export = {
  getLastMessageText: getLastMessageText,
  addSpew: addSpew,
  getAllUsersInCurrentGroup: getAllUsersInCurrentGroup
};