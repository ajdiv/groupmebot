import mongoose = require('mongoose');

interface ICustomEvent extends mongoose.Document {
  gmeUserId: number;
  gmeGroupId: number;
  eventName: string;
  eventDate: Date;
}

const CustomEventSchema: mongoose.Schema<ICustomEvent> = new mongoose.Schema({
  gmeUserId: { type: Number, required: true },
  gmeGroupId: { type: Number, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true }
});

export = mongoose.model<ICustomEvent>("CustomEventModel", CustomEventSchema);