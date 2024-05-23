import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedUser = jwt.verify(token, process.env.LEXICONAI_JWT_SECRET as string);
        (req as any).user = decodedUser;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
