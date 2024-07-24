import mongoose from "mongoose";
import { IUser } from "../types/types"

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordReset: {
      token: { type: String, required: false },
      expiration: { type: Number, required: false },
      url: { type: String, required: false },
    },
    createdAt: { type: Date, default: Date.now },
  });

const User = mongoose.model<IUser>('User', userSchema);

export default User;