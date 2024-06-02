import mongoose, { Schema } from 'mongoose';

const EntrySchema: Schema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: { type: [String], default: [] }
});

export default mongoose.model<IEntry>('Post', EntrySchema);
