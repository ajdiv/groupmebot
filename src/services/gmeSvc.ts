import Spew = require('../models/Mongo/SpewModel');
import groupmeApiSvc = require('./groupmeApiSvc');
import _ = require('lodash');
import { GroupmeUserModel } from '../models/Groupme/GroupmeUserModel';

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

async function getAllUsersInCurrentGroup(): Promise<GroupmeUserModel[]> {
  const group = await groupmeApiSvc.getCurrentGroup();
  const members = group.members;
  return members;
}

async function getLastMessageText(): Promise<string> {
  const lastMessages = await groupmeApiSvc.getMessages(2, null, null);
  const message = lastMessages[1]; // We actually take the second to last because the last message was the command itself
  return message.text;
}

export = {
  getLastMessageText: getLastMessageText,
  addSpew: addSpew,
  getAllUsersInCurrentGroup: getAllUsersInCurrentGroup
};