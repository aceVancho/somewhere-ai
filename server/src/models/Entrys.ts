import mongoose, { Schema } from 'mongoose';
import IEntry from '../types/types'

const EntrySchema: Schema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: { type: [String], default: [] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEntry>('Post', EntrySchema);
