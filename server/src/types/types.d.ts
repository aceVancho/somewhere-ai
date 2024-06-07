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
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

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
