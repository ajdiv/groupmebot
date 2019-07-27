import mongoose = require('mongoose');

interface IDailyUserPostCounter extends mongoose.Document {
  gmeUserId: number;
  gmeGroupId: number,
  messageCount: number;
  date: Date;
}

var DailyUserPostCounterSchema = new mongoose.Schema({
  gmeUserId: { type: Number, required: true },
  gmeGroupId: { type: Number, required: true },
  messageCount: { type: Number, required: true },
  date: { type: Date, required: true },
});

// Export the model
var DailyUserPostCounter = mongoose.model<IDailyUserPostCounter>("DailyUserPostCounter", DailyUserPostCounterSchema);
export = DailyUserPostCounter;