import { fetchVNIndex } from './services/vnindexService';

// const INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const INTERVAL_MS = 60 * 1000; // 1 minute

export const startScheduler = () => {
    console.log('Starting VNIndex Scheduler (every 1 hour)...');

    // Run immediately on start
    fetchVNIndex();

    setInterval(async () => {
        console.log('Scheduler: Fetching VNIndex data...');
        await fetchVNIndex();
    }, INTERVAL_MS);
};
