import mongoose, { Schema } from 'mongoose';

const EntrySchema: Schema = new Schema({
  title: { type: String, default: '' },
  text: { type: String, required: true },
  tags: { type: [String], default: [] },
  analysis: { type: String, default: '' },
  sentiment: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEntry>('Entry', EntrySchema);