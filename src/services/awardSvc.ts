import _ = require('lodash');
import moment = require('moment');

// Models
import * as DailyUserPostCounter from '../models/dailyUserPostCounter.model';

function addMsgCounter(gmeUserId, gmeGroupId) {

    if (!gmeUserId) return Promise.resolve();

    var today = moment(new Date()).startOf('day').toDate();
    var tomorrow = moment(new Date()).add(1, 'days').startOf('day').toDate();

    //Find existing message counter for today. If doesn't exist, create one
    return DailyUserPostCounter.findOne(
        {
            gmeUserId: gmeUserId,
            gmeGroupId: gmeGroupId,
            date: { $gte: today, $lt: tomorrow }
        }).then(result => {
            if (!result) {
                let counter = new DailyUserPostCounter({
                    gmeUserId: gmeUserId,
                    gmeGroupId: gmeGroupId,
                    messageCount: 1,
                    date: today
                });
                return counter.save();
            } else {
                result.messageCount++;
                return result.save();
            }
        });
}

function getAwards(gmeGroupId, memberArr) {

    var todayRaw = new Date();
    var today = todayRaw.setHours(0, 0, 0, 0);
    var tomorrow = todayRaw.setDate(todayRaw.getDate() + 1);

    return DailyUserPostCounter.find(
        {
            gmeGroupId: gmeGroupId,
            date: { $gte: today, $lt: tomorrow }
        })
        .sort({ messageCount: -1 }).then(results => {
            // Note: there will always be a result at this point, 
            //since the user would have had to /awards to get to this point           
            return createAwardsObj(results, memberArr);
        });
}

function createAwardsObj(awardArr, memberArr) {
    var result = "Here are the rankings: ";
    // Filter out any nonsense - bots or otherwise
    var resultArr = [];
    var numResults = 0;

    awardArr.foreach(person => {
        var match = _.find(memberArr, x => x.user_id === person.gmeUserId.toString());
        if (match) {
            resultArr.push(match.nickname + " (" + person.messageCount + ")");
        }
    });

    for (var i = 0; i < resultArr.length; i++) {
        result += resultArr[i];
        // If we are at the end of the array, don't add dots
        if (i != resultArr.length - 1) {
            result += "..........";
        }
    }

    return result;
}

export = {
    addMsgCounter: addMsgCounter,
    getAwards: getAwards
}