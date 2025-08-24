import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`TypeScript backend server running on http://localhost:${PORT}`);
});