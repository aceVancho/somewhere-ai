import mongoose, { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }

  interface IUser {
    email: string;
    password: string;
    createdAt: Date;
  }

  interface IEntry extends mongoose.Document {
    title: string;
    text: string;
    tags: string[];
    analysis: string;
    sentiment: number;
    goals: string[];
    encouragements: string[];
    questions: string[]
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

  // title: { type: String, default: '' },
  // text: { type: String, required: true },
  // tags: { type: [String], default: [] },
  // analysis: { type: String, default: '' },
  // sentiment: { type: Number, default: 0 },
  // goals: { type: [String], default: [] },
  // encouragements: { type: [String], default: [] },
  // questions: { type: [String], default: [] },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now }

  interface EntryChunk {
    id: string;
    content: string;
    parentEntryId: string;
    userId: string;
    chunkNumber: number;
    createdDate: string;
    embedding?: number[];
    metadata: Record<string, any>;
  }
  
  interface UpsertProps {
    userId: string;
    entryId: string;
    text: string;
    date: string;
  }
}

export { IUser, IEntry };
