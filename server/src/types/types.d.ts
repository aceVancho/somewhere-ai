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

  interface IEntry extends Document {
    title: string;
    text: string;
    tags: string[];
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }
}

export { IUser, IEntry };
