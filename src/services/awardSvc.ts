import _ = require('lodash');
import moment = require('moment');

// Models
import * as DailyUserPostCounter from '../models/dailyUserPostCounter.model';

function addMsgCounter(gmeUserId, gmeGroupId) {
    
    if(!gmeUserId) return Promise.resolve();

    var today = moment(new Date()).startOf('day').toDate();
    var tomorrow = moment(new Date()).add(1,'days').startOf('day').toDate();

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

    for (var i = 0; i < awardArr.length; i++) {
        var person = awardArr[i];
        var match = _.find(memberArr, x => x.user_id === person.gmeUserId.toString());
        if (match) {
            result += match.nickname + " (" + person.messageCount + ")";
            // If we have more coming, then add some periods. This is until we can find out new line characters
            if (i !== awardArr.length - 1 && person.gmeUserId !== 0) {
                result += "..........";
            }
        }
    }
    return result;
}

export = {
    addMsgCounter: addMsgCounter,
    getAwards: getAwards
}