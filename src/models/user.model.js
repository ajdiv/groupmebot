const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    gmeUserId: {type: Number, required: true},
    gmeGroupId: {type: Number, required: true},
});

var User =   mongoose.model('User', UserSchema);
// Export the model
module.exports = User;