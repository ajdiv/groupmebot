import mongoose = require('mongoose');

interface IDailyUserPostCounter extends mongoose.Document {
  gmeUserId: number;
  gmeGroupId: number,
  messageCount: number;
  date: Date;
}

const DailyUserPostCounterSchema: mongoose.Schema<IDailyUserPostCounter> = new mongoose.Schema({
  gmeUserId: { type: Number, required: true },
  gmeGroupId: { type: Number, required: true },
  messageCount: { type: Number, required: true },
  date: { type: Date, required: true },
});

export = mongoose.model<IDailyUserPostCounter>("DailyUserPostCounterModel", DailyUserPostCounterSchema);