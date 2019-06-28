const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SpewSchema = new Schema({
    gmeUserId: {type: Number, required: true},
    spewCount: {type: Number, required: true},
    spewDate: {type: Date, required: true},
});

var Spew =   mongoose.model('Spew', SpewSchema);
// Export the model
module.exports = Spew;