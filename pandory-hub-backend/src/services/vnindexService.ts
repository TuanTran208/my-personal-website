import fs from 'fs';
import path from 'path';
import { sendDiscordAlert } from './alertService';

const DATA_FILE = path.join(__dirname, '../../data/vnindex.json');
let lastAlertDate: string | null = null; // Simple in-memory debounce. For prod, save to file.

export interface VNIndexData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export const fetchVNIndex = async (): Promise<VNIndexData | null> => {
    try {
        const end = Math.floor(Date.now() / 1000);
        const start = end - 86400; // Look back 24 hours to ensure we get data
        const url = `https://dchart-api.vndirect.com.vn/dchart/history?symbol=VNINDEX&resolution=60&from=${start}&to=${end}`;

        console.log(`Fetching VNIndex data from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.s === 'ok' && data.t && data.t.length > 0) {
            // Get the latest candle
            const idx = data.t.length - 1;

            const vnIndexData: VNIndexData = {
                timestamp: data.t[idx],
                open: data.o[idx],
                high: data.h[idx],
                low: data.l[idx],
                close: data.c[idx],
                volume: data.v[idx]
            };

            saveData(vnIndexData);
            return vnIndexData;
        } else {
            console.warn('No data found for VNINDEX');
            return null;
        }
    } catch (error) {
        console.error('Error fetching VNIndex:', error);
        return null;
    }
};

const saveData = (data: VNIndexData) => {
    try {
        let history: VNIndexData[] = [];
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
            try {
                history = JSON.parse(fileContent);
                if (!Array.isArray(history)) history = [];
            } catch (e) {
                console.warn('Corrupt data file, resetting.');
                history = [];
            }
        }

        // Add new data if it doesn't exist (based on timestamp)
        const exists = history.find(d => d.timestamp === data.timestamp);
        if (!exists) {
            history.push(data);
            // Keep only last 30 days roughly (24 * 30 = 720 points)
            if (history.length > 720) {
                history = history.slice(-720);
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify(history, null, 2));
            console.log('VNIndex data saved successfully.');
        } else {
            console.log('VNIndex data for this timestamp already exists.');
        }

    } catch (error) {
        console.error('Error saving data:', error);
    }
}

const checkAndAlert = (data: VNIndexData) => {
    const thresholdEnv = process.env.VNINDEX_ALERT_THRESHOLD;
    if (!thresholdEnv) return;

    const threshold = parseFloat(thresholdEnv);
    if (isNaN(threshold)) return;

    if (data.close < threshold) {
        const today = new Date().toDateString();

        // Only alert once per day to avoid spamming every hour
        if (lastAlertDate !== today) {
            const msg = `📉 **VNINDEX ALERT**: The index has dropped to **${data.close}**, which is below your threshold of ${threshold}.`;
            sendDiscordAlert(msg, true);
            lastAlertDate = today;
            console.log(`Alert triggers! Sent notification for ${today}.`);
        }
    }
}

export const getHistory = (): VNIndexData[] => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error('Error reading history:', error);
    }
    return [];
}
