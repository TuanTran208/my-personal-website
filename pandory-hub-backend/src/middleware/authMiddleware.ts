import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pandory_fallback_secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    // 1. Check Bearer Token if provided
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            (req as any).user = decoded; // Attach for downstream routes if needed
        } catch (error) {
            // Invalid or expired token (log it but don't block, treat as guest)
            console.warn('Invalid token provided in request headers');
        }
    }

    // 2. Allow request to proceed. 
    // All routes are open by default. Downstream routes that require protection 
    // must explicitly check `req.user?.isOwner` internally.
    next();
};
