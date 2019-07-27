import mongoose = require('mongoose');

interface IUser extends mongoose.Document {
    gmeUserId: number;
    gmeGroupId: number
}

let UserSchema = new mongoose.Schema({
    gmeUserId: {type: Number, required: true},
    gmeGroupId: {type: Number, required: true},
});

// Export the model
var User =   mongoose.model<IUser>('User', UserSchema);
export = User;