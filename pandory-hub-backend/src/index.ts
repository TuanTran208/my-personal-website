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
// --- Utilities Routes ---
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { mediaService } from './services/mediaService';
import { authMiddleware } from './middleware/authMiddleware';

// Configure Multer
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

// Apply Security to all utility routes
app.use('/api/utilities', authMiddleware);

// 1. Compress Video
app.post('/api/utilities/compress-video', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const quality = req.body.quality || 'Medium';
  const format = req.body.format || 'mp4';

  try {
    const outputPath = await mediaService.compressVideo(req.file.path, quality, format);
    res.download(outputPath, (err) => {
      mediaService.cleanup(req.file!.path); // Clean upload
      // mediaService.cleanup(outputPath); // Keep for a bit or cron job cleans it? For now leave it.
    });
  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ error: 'Compression failed' });
  }
});

// 2. Download Video
app.post('/api/utilities/download-video', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const result = await mediaService.downloadVideo(url);
    res.download(result.path, `${result.title}.mp4`);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// 3. Convert Image
app.post('/api/utilities/convert-image', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const format = req.body.format || 'png';

  try {
    const outputPath = await mediaService.convertImage(req.file.path, format);
    res.download(outputPath, (err) => {
      mediaService.cleanup(req.file!.path);
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// 4. PDF to DOCX (Placeholder)
// 4. PDF to Markdown/DOCX
app.post('/api/utilities/pdf-to-docx', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const format = req.body.format || 'markdown'; // 'markdown' or 'docx'

  try {
    const outputPath = await mediaService.convertPdf(req.file.path, format);
    res.download(outputPath, (err) => {
      mediaService.cleanup(req.file!.path);
    });
  } catch (error: any) {
    console.error('PDF Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`TypeScript backend server running on http://localhost:${PORT}`);
  startScheduler();
});