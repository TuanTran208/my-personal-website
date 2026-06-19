import { fetchVNIndex } from './services/vnindexService';

// const INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const INTERVAL_MS = 60 * 1000; // 1 minute

export const startScheduler = () => {
    console.log('Starting VNIndex Scheduler (every 1 minute)...');
    console.log('Scheduler Rule: Mon-Fri, 09:00 - 14:45 (Asia/Ho_Chi_Minh)');

    // Initial check (optional, or just wait for interval)
    checkAndRun();

    setInterval(() => {
        checkAndRun();
    }, INTERVAL_MS);
};

const checkAndRun = async () => {
    const now = new Date();

    // Get Vietnam time parts
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
    };

    // Format: "Mon, 09:30" or similar depending on locale, safer to get parts
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);

    const getPart = (type: string) => parts.find(p => p.type === type)?.value;

    const weekday = getPart('weekday'); // "Mon", "Tue", ...
    const hour = parseInt(getPart('hour') || '0', 10);
    const minute = parseInt(getPart('minute') || '0', 10);

    // 1. Check Weekend
    if (weekday === 'Sat' || weekday === 'Sun') {
        // console.log('Scheduler: Skipping (Weekend)');
        return;
    }

    // 2. Check Time (09:00 to 14:45)
    // Convert to minutes for easy comparison
    const currentMinutes = hour * 60 + minute;
    const startMinutes = 9 * 60;        // 09:00 = 540
    const endMinutes = 14 * 60 + 45;    // 14:45 = 885

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        console.log(`Scheduler: In Trading Hours (${hour}:${minute.toString().padStart(2, '0')}). Fetching...`);
        await fetchVNIndex();
    } else {
        // console.log(`Scheduler: Skipping (Outside Trading Hours: ${hour}:${minute})`);
    }
};
