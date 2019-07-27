import _ = require('lodash');

// Models
import * as DailyUserPostCounter from '../models/dailyUserPostCounter.model';

function addMsgCounter(gmeUserId, gmeGroupId) {

    var todayRaw = new Date();
    var today = todayRaw.setHours(0, 0, 0, 0);
    var tomorrow = todayRaw.setDate(todayRaw.getDate() + 1);

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

    for(var i = 0; i < awardArr.length; i++){
        var person = awardArr[i];
        var match = _.find(memberArr, x => x.user_id === person.gmeUserId.toString());
        if (match) {
            result += match.nickname + " (" + person.messageCount + ")";
        }

        // If we have more coming, then add some periods. This is until we can find out new line characters
        if(i !== 0 && i !== awardArr.length - 1){
            result += "..........";
        }
    }
    return result;
}

export = {
    addMsgCounter: addMsgCounter,
    getAwards: getAwards
}