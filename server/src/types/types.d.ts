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
    questions: string[]
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

  interface EntryChunk {
    id: string;
    embedding?: number[];
    metadata: {
      content: string;
      parentEntryId: string;
      userId: string;
      chunkNumber: number;
      createdDate: string;
    }
  }
  
  interface UpsertProps {
    userId: string;
    entryId: string;
    text: string;
    date: string;
  }
}

export { IUser, IEntry };
