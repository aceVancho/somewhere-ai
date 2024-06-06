import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Users';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization required.' });
    }

    const token = authHeader.split(' ')[1];

    // try {
    //     const decodedUser = jwt.verify(token, process.env.SOMEWHERE_JWT_SECRET as string);
    //     (req as any).user = decodedUser;
    //     next();
    // } catch (error) {
    //     return res.status(403).json({ message: 'Invalid or expired token.' });
    // }
    try {
        const decoded: any = jwt.verify(token, process.env.SOMEWHERE_JWT_SECRET as string);
        const user = await User.findById(decoded.userId);
        if (!user) {
          throw new Error();
        }
        req.user = user; // Attach the user to the request object
        next();
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
      }
};
