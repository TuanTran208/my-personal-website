import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startScheduler } from './scheduler';
import { getHistory } from './services/vnindexService';
import { sendDiscordAlert } from './services/alertService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// --- API Routes ---

// The route to track a stock symbol
app.get('/api/stock/:symbol', async (req: Request, res: Response) => {
  const { symbol } = req.params;
  const url = `https://api-finfo.vndirect.com.vn/v4/stock_prices?q=code:${symbol.toUpperCase()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch from VNDirect API');
    }
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: `Stock with symbol '${symbol}' not found.` });
    }

    const stock = data.data[0];

    // Send the relevant data back to the frontend
    res.json({
      symbol: stock.code,
      price: stock.close,
      change: stock.change,
      pctChange: stock.pctChange,
      volume: stock.nmVolume,
    });

  } catch (error) {
    console.error('Backend error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data.' });
  }
});

// Route to get VNIndex history
app.get('/api/vnindex', (req: Request, res: Response) => {
  const history = getHistory();
  res.json(history);
});

// Route to get Detailed Stock Info (Graham Metrics)
import { getStockDetails, getStockHistory } from './services/stockDetailService';
app.get('/api/stock-details/:symbol', async (req: Request, res: Response) => {
  const { symbol } = req.params;
  try {
    const details = await getStockDetails(symbol);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
});

// Route to get Stock History (Chart)
app.get('/api/stock-history/:symbol', async (req: Request, res: Response) => {
  const { symbol } = req.params;
  try {
    const history = await getStockHistory(symbol);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

// Route to manually test Discord Alert
// Route to manually test Discord Alert
app.get('/api/test-alert', async (req: Request, res: Response) => {
  // Simulate a real warning message
  const threshold = process.env.VNINDEX_ALERT_THRESHOLD || '1700';
  const fakePrice = 1195.50;
  const msg = `📉 **VNINDEX ALERT**: The index has dropped to **${fakePrice}**, which is below your threshold of ${threshold}.`;

  await sendDiscordAlert(msg, true);
  res.send("Alert sent! Check your Discord channel for the simulated warning.");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`TypeScript backend server running on http://localhost:${PORT}`);
  startScheduler();
});