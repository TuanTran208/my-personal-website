import express, { Request, Response } from 'express';
import { getSystemHealth } from '../services/healthService';

const router = express.Router();
console.log('Health router initialized');

router.get('/', async (req: Request, res: Response) => {
    try {
        const healthData = await getSystemHealth();
        res.json(healthData);
    } catch (error) {
        console.error('Error fetching system health:', error);
        res.status(500).json({ error: 'Failed to fetch system health data' });
    }
});

export default router;
