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
    createdAt: Date;
    updatedAt: Date;
    tags?: string[];
  }
}

export { IUser, IEntry }; // Ensure this file is treated as a module
