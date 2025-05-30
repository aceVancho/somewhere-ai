import mongoose, { Schema } from 'mongoose';
import { IEntry } from "../types/types"

const EntrySchema: Schema = new Schema({
  title: { type: String, default: '' },
  text: { type: String, required: true },
  editorStateJSON: { type: Object, default: {} },
  tags: { type: [String], default: [] },
  analysis: { type: String, default: '' },
  sentiment: { type: Number, default: 0 },
  goals: { type: [String], default: [] },
  questions: { type: [String], default: [] },
  summaries: [{
    summary: { type: String, required: true },
    quote: { type: String, required: true }
  }],
  trends: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEntry>('Entry', EntrySchema);
