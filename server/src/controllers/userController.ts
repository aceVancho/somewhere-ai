import { Request, Response } from "express";
import User from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import crypto from 'crypto';

const nodemailer = require("nodemailer");

export const register = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      password: hashedPassword,
      email: req.body.email,
    });
    const savedUser = await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.SOMEWHERE_JWT_SECRET as string
    );

    res.status(201).json({
      id: savedUser._id,
      email: savedUser.email,
      token,
    });
  } catch (error: unknown) {
    const message = (error as Error)?.message || "An unknown error occurred.";
    res.status(500).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );
    res.json({ message: `User updated successfully: ${updatedUser}` });
  } catch (error) {
    res.status(400).json({ message: "Error updating user." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user." });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !("password" in user))
      return res.status(404).json({ message: "Could not find user." });

    const passwordsMatch = await bcrypt.compare(
      oldPassword,
      user.password as string
    );
    if (!passwordsMatch)
      return res.status(400).json({ message: "Passwords do not match." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error changing password." });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !("password" in user))
      return res.status(404).json({ message: "User not found." });

    const passwordsMatch = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!passwordsMatch)
      return res.status(400).json({ message: "Invalid password." });

    const token = jwt.sign(
      { userId: user._id },
      process.env.SOMEWHERE_JWT_SECRET as string
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error signing in." });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id); // Note the use of _id
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error verifying user." });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.ETHEREAL_EMAIL_ADDRESS,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  });

  const sendPasswordResetEmail = async (user: IUser, passwordResetUrl: string) => {
    try {
      await transporter.sendMail({
        from: `${process.env.ETHEREAL_FULL_NAME} < ${process.env.ETHEREAL_EMAIL_ADDRESS}>`, // sender address
        to: user.email, // list of receivers
        subject: "meGPT Password Reset", // Subject line
        text: "Hiya! It looks like you want to reset your password?", // plain text body
        html: `
        <div style="display: flex; justify-content: center; align-items: flex-start; height: 100vh; width: 100vw; box-sizing: border-box; padding: 20px; background-color: #000;">
          <div style="text-align: center; width: 100%;">
            <h1 style="color: #fff;">Reset your password</h1>
            <p style="color: #fff;">Hiya! It looks like you want to reset your password. Click the link below to reset it:</p>
            <a href="${passwordResetUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
        </div>
      `, // html body
      });
    } catch (error) {
      console.error(error);
    }
  };

  const passwordResetToken = crypto.randomBytes(32).toString('hex')
  const passwordResetTokenExpiration = Date.now() + 3600000;
  const passwordResetUrl = `http://localhost:4002/passwordreset?token=${passwordResetToken}`


  try {
    const user = await User.findById(req.user._id); // Note the use of _id
    if (!user) return res.status(404).json({ message: "User not found." });

    user.passwordReset.token = passwordResetToken;
    user.passwordReset.expiration = passwordResetTokenExpiration;
    user.passwordReset.url = passwordResetUrl;

    await user.save();
    sendPasswordResetEmail(user, passwordResetUrl);

    console.log('user after save', user)

    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error Resetting User Password" });
  }
};
