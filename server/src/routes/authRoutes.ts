import express, { Request, Response } from 'express';
import User from '../models/Users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { authMiddleware } from '../middleware/middleware';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            password: hashedPassword,
            email: req.body.email,
        });
        const savedUser = await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SOMEWHERE_JWT_SECRET as 'string')

        res.status(201).json({ 
            id: savedUser._id, 
            email: savedUser.email,
            token 
        });
    } catch (error: unknown) {
        const message = (error as Error)?.message || 'An unknown error occurred.'
        res.status(500).json({ message });
    }
});

router.put('/update/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    // const { username, email } = req.body;
    const { email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { email }, { new: true });
        res.json({ message: `User updated successfully: ${updatedUser}`})
    } catch (error) {
        res.status(400).json({ message: 'Error updating user.' })
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user.' });
    }
});

router.post('/changePassword', async (req: Request, res: Response) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user || !('password' in user)) return res.status(404).json({ message: 'Could not find user.' });

        const passwordsMatch = await bcrypt.compare(oldPassword, user.password as 'string');
        if (!passwordsMatch) return res.status(400).json({ message: 'Passwords do not match. '})

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    } catch (error) {
        res.status(500).json({ message: 'Error changing password.' });
    }
});

router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !('password' in user)) return res.status(404).json({ message: 'User not found.' });

        const passwordsMatch = await bcrypt.compare(password, user.password as 'string')
        if (!passwordsMatch) return res.status(400).json({ message: 'Invalid password.' });

        const token = jwt.sign({ userId: user._id }, process.env.SOMEWHERE_JWT_SECRET as 'string')
        res.json({ token, user: { email: user.email } }); 
    } catch (error) {
        res.status(500).json({ message: 'Error signing in.' });
    }
})

router.get('/verify', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user.userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user.' });
    }
});


export default router;