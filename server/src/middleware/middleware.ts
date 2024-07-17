import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Users';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded: any = jwt.verify(token, process.env.SOMEWHERE_JWT_SECRET as string);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user; // Attach the user to the request object
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const socketAuthMiddleware = async (socket: any, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        console.error('Authorization required.')
        return next(new Error('Authorization required.'));
    }

    try {
        const decoded: any = jwt.verify(token, process.env.SOMEWHERE_JWT_SECRET as string);
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.error('User not found.')
            return next(new Error('User not found.'));
        }
        socket.user = user;
        next();
    } catch (error) {
        console.error('Invalid token.')
        next(new Error('Invalid token.'));
    }
};
