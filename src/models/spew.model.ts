import mongoose = require('mongoose');

interface ISpew extends mongoose.Document {
    gmeUserId: number;
    spewCount: number,
    spewDate: Date;
}

let SpewSchema = new mongoose.Schema({
    gmeUserId: { type: Number, required: true },
    spewCount: { type: Number, required: true },
    spewDate: { type: Date, required: true },
});

// Export the model
var Spew = mongoose.model<ISpew>('Spew', SpewSchema);
export = Spew;