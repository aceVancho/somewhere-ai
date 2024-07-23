import mongoose from "mongoose";
import { IUser } from "../types/types"

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    passwordReset: {
        token: { type: String, required: true, unique: true },
        expiration: { type: Number, required: true, unique: true },
        url: { type: String, required: true, unique: true },
    },
    createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model<IUser>('User', userSchema);

export default User;