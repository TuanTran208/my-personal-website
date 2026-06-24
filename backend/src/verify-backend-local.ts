import dotenv from 'dotenv';
dotenv.config();

import { sendDiscordAlert } from './services/alertService';
import { getHistory } from './services/vnindexService';

async function run() {
    try {
        console.log('Fetching FPT from localhost:3001...');
        const res = await fetch('http://localhost:3001/api/stock-details/FPT');
        if (res.ok) {
            const data: any = await res.json();
            console.log('Success!');
            console.log('Symbol:', data.symbol);
            console.log('Growth:', data.epsGrowth);
            console.log('Stability:', data.earningStability);
        } else {
            console.error('Failed:', res.status, res.statusText);
        }
    } catch (e: any) {
        console.error('Error:', e.message);
    }
}

async function run2() {
    try {
        console.log('Sending Discord alert...');
        console.log('DISCORD_WEBHOOK_URL:', process.env.DISCORD_WEBHOOK_URL);
        await sendDiscordAlert('Hello from backend local test!', true);
        console.log('Success!');
    } catch (e: any) {
        console.error('Error:', e.message);
    }
}

// Call run2 to test the Discord Alert API
run2();
