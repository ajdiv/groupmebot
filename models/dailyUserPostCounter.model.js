const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DailyUserPostCounterSchema = new Schema({
    gmeUserId: {type: Number, required: true},
    gmeGroupId: {type: Number, required: true},
    messageCount: {type: Number, required: true},
    date: {type: Date, required: true},
});

var User =   mongoose.model('DailyUserPostCounter', DailyUserPostCounterSchema);
// Export the model
module.exports = User;