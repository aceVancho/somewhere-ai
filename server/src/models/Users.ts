import mongoose from "mongoose";

interface IUser {
    // username: string;
    email: string;
    password: string;
    createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    // username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model<IUser>('User', userSchema);

export default User;