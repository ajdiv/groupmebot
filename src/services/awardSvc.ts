import _ = require('lodash');
import moment = require('moment');

// Models
import * as DailyUserPostCounter from '../models/dailyUserPostCounter.model';

function addMsgCounter(gmeUserId, gmeGroupId) {

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
        });
}

function getAwards(gmeGroupId, memberArr) {

    var time = getTodayAndTomorrow();
    var begin = time[0];
    var end = time[1];

    return DailyUserPostCounter.find(
        {
            gmeGroupId: gmeGroupId,
            date: { $gte: begin, $lt: end }
        })
        .sort({ messageCount: -1 }).then(results => {
            // Note: there will always be a result at this point, 
            //since the user would have had to /awards to get to this point           
            return createAwardsObj(results, memberArr);
        });
}

function createAwardsObj(awardArr, memberArr) {
    var result = "Here's who posted the most today: ";
    var resultArr = [];

    awardArr.forEach(person => {
        var match = _.find(memberArr, x => x.user_id === person.gmeUserId.toString());
        if (match) { // Filter out any nonsense - bots or otherwise
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

//TODO: Move this to a utility class
function getTodayAndTomorrow(){

    // If we are before 4AM, consider 4AM of yesterday the start
    var now = moment(new Date());
    var begin;
    if(now.hour() < 4){
        begin = now.subtract(1,'days').startOf('day').add(4,'hours').toDate();
    } else{        
        begin = now.startOf('day').add(4,'hours').toDate();
    }

    var end = moment(begin).add(1, 'days').subtract(1, 'milliseconds').toDate();

    return [begin, end];
}

export = {
    addMsgCounter: addMsgCounter,
    getAwards: getAwards
}