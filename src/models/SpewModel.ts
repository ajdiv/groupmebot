import mongoose = require('mongoose');

interface ISpew extends mongoose.Document {
  gmeUserId: number;
  spewCount: number,
  spewDate: Date;
}

const SpewSchema = new mongoose.Schema({
  gmeUserId: { type: Number, required: true },
  spewCount: { type: Number, required: true },
  spewDate: { type: Date, required: true },
});

export = mongoose.model<ISpew>('SpewModel', SpewSchema);