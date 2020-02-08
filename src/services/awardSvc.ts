import _ = require('lodash');
import moment = require('moment');

import DailyUserPostCounter = require('../models/DailyUserPostCounterModel');
import groupmeApiSvc = require('./groupmeApiSvc');
import { GroupmeMessageModel } from '../models/GroupmeMessageModel';
import { SenderType } from '../models/GroupmeSenderType';
import { UserStatsModel } from '../models/UserStatsModel';

function addMsgCounter(gmeUserId: number, gmeGroupId: number): Promise<void> {
  if (!gmeUserId) return Promise.resolve();

  var time = getTodayAndTomorrow();
  var begin = time[0];
  var end = time[1];

  //Find existing message counter for today. If doesn't exist, create one
  return DailyUserPostCounter.findOne(
    {
      gmeUserId: gmeUserId,
      gmeGroupId: gmeGroupId,
      date: { $gte: begin, $lt: end }
    }).then(result => {
      if (!result) {
        let counter = new DailyUserPostCounter({
          gmeUserId: gmeUserId,
          gmeGroupId: gmeGroupId,
          messageCount: 1,
          date: moment().valueOf()
        });
        return counter.save();
      } else {
        result.messageCount++;
        return result.save();
      }
    }).then(() => {
      return Promise.resolve()
    });
}

async function getAwards(): Promise<string> {

  const time = getTodayAndTomorrow();
  const begin = time[0];
  const end = time[1];

  //Get last messages until we hit the beginning time
  let keepLooping = true;
  let beforeId = null;
  let userStatsArr: UserStatsModel[] = [];
  while (keepLooping) {
    let messages = await groupmeApiSvc.getMessages(100, beforeId, null) as GroupmeMessageModel[];
    messages = _.filter(messages, x => x.sender_type != SenderType.Bot);
    _.each(messages, message => {
      if (message.created_at_date <= begin) {
        keepLooping = false;
        return false; //break
      }
      let user = _.find(userStatsArr, x => x.user_id === message.user_id);
      if (!user) {
        user = new UserStatsModel(message.user_id, message.name);
        userStatsArr.push(user);
      }
      user.messageCount++;
      user.likeCount += message.favorited_by.length;

      beforeId = message.id;
      return undefined; //continue
    });
  }

  let result = '';
  result += getTopMessages(userStatsArr);
  result += '\n';
  result += getMostLikeable(userStatsArr);
  return result;
}

function getTopMessages(userStatsArr: UserStatsModel[]): string {

  let topMessageString = "Most Messages Sent:\n    ";
  let topMessageResultArr: string[] = [];
  const topMessages = _.sortBy(userStatsArr, x => x.messageCount, 'desc');
  _.each(topMessages, stats => {
    topMessageResultArr.push(stats.nickname + " (" + stats.messageCount + ")");
  });

  for (var i = 0; i < topMessageResultArr.length; i++) {
    topMessageString += topMessageResultArr[i];
    // If we are at the end of the array, don't add dots
    if (i != topMessageResultArr.length - 1) {
      topMessageString += "\n    ";
    }
  }
  return topMessageString;
}

function getMostLikeable(userStatsArr: UserStatsModel[]): string {

  let likeableString = "Most Likeable:\n    ";
  let likeableResultArr: string[] = [];
  const likeableUsers = _.sortBy(userStatsArr, x => x.likeCount / x.messageCount, 'desc');
  _.each(likeableUsers, stats => {
    likeableResultArr.push(`${stats.nickname} (${stats.likeCount} like${stats.likeCount === 1 ? '' : 's'} in ${stats.messageCount} message${stats.messageCount === 1 ? '' : 's'})`);
  });

  for (var i = 0; i < likeableResultArr.length; i++) {
    likeableString += likeableResultArr[i];
    // If we are at the end of the array, don't add dots
    if (i != likeableResultArr.length - 1) {
      likeableString += "\n    ";
    }
  }
  return likeableString;
}

//TODO: Move this to a utility class
function getTodayAndTomorrow() {

  // If we are before 4AM, consider 4AM of yesterday the start
  var now = moment(new Date());
  var begin;
  if (now.hour() < 4) {
    begin = now.subtract(1, 'days').startOf('day').add(4, 'hours').toDate();
  } else {
    begin = now.startOf('day').add(4, 'hours').toDate();
  }

  var end = moment(begin).add(1, 'days').subtract(1, 'milliseconds').toDate();

  return [begin, end];
}

export = {
  addMsgCounter: addMsgCounter,
  getAwards: getAwards
}