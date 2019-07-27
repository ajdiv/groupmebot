// Models
import * as DailyUserPostCounter from '../models/dailyUserPostCounter.model';

function addMsgCounter(gmeUserId, gmeGroupId) {

    var todayRaw = new Date();
    var today = todayRaw.setHours(0, 0, 0, 0);    
    var tomorrow = todayRaw.setDate(todayRaw.getDate()  + 1);

    //Find existing message counter for today. If doesn't exist, create one
    DailyUserPostCounter.findOne(
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

export = {
    addMsgCounter: addMsgCounter
}