
import { Request, Response, NextFunction } from 'express';

const ACCESS_KEY = process.env.API_ACCESS_KEY || 'pandory_secret'; // Default for dev if not set

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Allow if no key is configured (optional, but unsafe for production)
    // But here we enforce it.

    const clientKey = req.headers['x-access-key'];

    if (!clientKey || clientKey !== ACCESS_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Access Key' });
    }

    next();
};
