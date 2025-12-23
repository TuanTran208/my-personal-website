import { getCryptoDetails, getCryptoHistory } from './cryptoService';

export const getStockDetails = async (symbol: string) => {
    // Check for Crypto
    if (['BTC', 'ETH', 'SOL', 'DOGE', 'BITCOIN'].includes(symbol.toUpperCase()) || symbol.toUpperCase().endsWith('USDT')) {
        return await getCryptoDetails(symbol);
    }
    // 1. Fetch Basic Price
    const priceUrl = `https://api-finfo.vndirect.com.vn/v4/stock_prices?q=code:${symbol.toUpperCase()}&size=1&sort=date:desc`;
    // 2. Fetch Ratios (Sorted by reportDate desc to get latest)
    const ratioUrl = `https://api-finfo.vndirect.com.vn/v4/ratios?q=code:${symbol.toUpperCase()}&size=50&sort=reportDate:desc`;
    // 3. Fetch Financial Statements (For Assets/Debt/Equity) - Increased size to ensure we get all items
    const financialUrl = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol.toUpperCase()}~reportType:QUARTER&size=400&sort=fiscalDate:desc`;
    // 4. Fetch Historical Net Profit (For Growth/Stability) - Code 14200 (Common) or 413220 (Bank-ish?), 21900/700089 (Securities)
    // Query multiple codes to cover different sectors (Manufacturing, Bank, Securities)
    const profitUrl = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol.toUpperCase()}~itemCode:14200,21900,700089~reportType:QUARTER&size=40&sort=fiscalDate:desc`;

    const headers = {
        'User-Agent': 'Mozilla/5.0'
    };

    try {
        const [priceRes, ratioRes, financialRes, profitRes] = await Promise.all([
            fetch(priceUrl, { headers }),
            fetch(ratioUrl, { headers }),
            fetch(financialUrl, { headers }),
            fetch(profitUrl, { headers })
        ]);

        if (!priceRes.ok) throw new Error(`Price API error: ${priceRes.status}`);
        if (!ratioRes.ok) throw new Error(`Ratio API error: ${ratioRes.status}`);
        // Financial is optional, don't throw blocking error but log it.
        const financialData = financialRes.ok ? await financialRes.json() : { data: [] };
        const profitData = profitRes.ok ? await profitRes.json() : { data: [] };

        const priceData = await priceRes.json();
        const ratioData = await ratioRes.json();

        if (!priceData.data || priceData.data.length === 0) {
            throw new Error(`Stock ${symbol} not found`);
        }

        const stats = priceData.data[0];
        const ratios = ratioData.data || [];
        const financials = financialData.data || [];
        const profits = profitData.data || []; // Array of { numericalValue, fiscalDate }

        const findRatio = (codes: string[]) => {
            const item = ratios.find((r: any) => codes.includes(r.ratioCode) || codes.includes(r.itemCode));
            return item ? item.value : null;
        };

        const findFinancial = (codes: number[]) => {
            // Find most recent matching item
            const item = financials.find((f: any) => codes.includes(f.itemCode));
            return item ? item.numericValue : 0;
        };

        // Codes found from probe: 
        // PE: 'PRICE_TO_EARNINGS', '51006'
        // PB: 'PRICE_TO_BOOK', '51012'
        // Dividend Yield: 'DIVIDEND_YIELD', '51033'
        const pe = findRatio(['PRICE_TO_EARNINGS', '51006', 'PRICE_TO_EARNINGS_AVG_CR_YD']);
        let pb = findRatio(['PRICE_TO_BOOK', '51012', 'PRICE_TO_BOOK_AVG_CR_YD']);
        const divYield = findRatio(['DIVIDEND_YIELD', '51033', '51016']);
        const shares = findRatio(['51025', 'LISTED_SHARES', '57070']); // Need shares for P/B calc

        // Assets: 12700 (Total Assets), 14400 (Total Resources), 27001 (Legacy), 700000 (Securities)
        const assets = findFinancial([27001, 27000, 12700, 14400, 10000 + 20000, 700000]);
        // Debt: 13000 (Total Liabilities), 30001 (Legacy/Bank), 37000 (Securities small?), Liabilities usually Assets-Equity if code missing
        let debt = findFinancial([30001, 30000, 30002, 13000, 37000]);
        // Equity: 14000 (Owner's Equity), 14100 (Securities)
        const equity = findFinancial([14000, 40000, 14100]);

        // Fallback for Debt if missing (Common in some Bank/Securities reports)
        if (debt === 0 && assets > 0 && equity > 0) {
            debt = assets - equity;
        }

        // Fallback for P/B (Common in small caps like DAH or Securities where PB ratio missing)
        if ((!pb || pb === 0) && stats.close && shares && equity) {
            const marketCap = stats.close * shares;
            if (equity > 0) {
                pb = marketCap / equity;
            }
        }

        // Calculate Current Ratio: Current Assets (11000) / Current Liabilities (13100)
        // Securities (700xxx) might not have "Current Assets" concept standardly.
        const currentAssets = findFinancial([11000, 700003]); // 700003 might be short term? Just guessing, sticking to standard.
        const currentLiabilities = findFinancial([13100, 30001]);

        let currentRatio = findRatio(['CURRENT_RATIO', '51703', 'QUICK_RATIO']);
        if (!currentRatio && currentLiabilities > 0) {
            currentRatio = currentAssets / currentLiabilities;
        }

        // --- Calculate Growth & Stability ---
        let epsGrowth = 0;
        let earningStability = false;

        if (profits.length > 0) {
            // Sort Descending (Newest first)
            profits.sort((a: any, b: any) => new Date(b.fiscalDate).getTime() - new Date(a.fiscalDate).getTime());

            // 1. Growth
            const latest = profits[0]?.numericValue || 0;
            const yearAgo = profits[4]?.numericValue || profits[profits.length - 1]?.numericValue || 0;

            if (yearAgo !== 0) { // Avoid division by zero
                epsGrowth = ((latest - yearAgo) / Math.abs(yearAgo)) * 100;
            }

            // 2. Stability
            const checkCount = Math.min(profits.length, 12);
            // Filter robustly
            const positiveCount = profits.slice(0, checkCount).filter((p: any) => p.numericValue > 0).length;
            earningStability = (positiveCount === checkCount);
        }

        return {
            symbol: stats.code,
            name: `${stats.code} Corp`,
            sector: 'Unknown',
            price: stats.close,
            change: stats.change,
            pctChange: stats.pctChange,
            volume: stats.nmVolume,
            pe: pe ?? 0,
            pb: pb ?? 0,
            currentRatio: currentRatio ?? 0,
            divYield: divYield ?? 0,
            epsGrowth: epsGrowth || 0,
            earningStability: earningStability,
            dividendStability: divYield > 0, // Simple proxy: pays dividend now = stable-ish
            assets: assets ?? 0,
            debt: debt ?? 0,
            equity: equity ?? 0
        };

    } catch (error) {
        console.error('Error fetching details:', error);
        throw error;
    }
};

export const getStockHistory = async (symbol: string) => {
    // Check for Crypto
    if (['BTC', 'ETH', 'SOL', 'DOGE', 'BITCOIN'].includes(symbol.toUpperCase()) || symbol.toUpperCase().endsWith('USDT')) {
        return await getCryptoHistory(symbol);
    }

    // VNDirect History (dchart)
    const end = Math.floor(Date.now() / 1000);
    const start = end - (30 * 24 * 60 * 60); // 30 days
    const url = `https://dchart-api.vndirect.com.vn/dchart/history?symbol=${symbol.toUpperCase()}&resolution=D&from=${start}&to=${end}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('History API Error');
        const data = await res.json();
        // VNDirect dchart format: { t: [], c: [], ... }
        if (!data.t || !data.c) return [];

        return data.t.map((timestamp: number, index: number) => ({
            date: new Date(timestamp * 1000).toISOString().split('T')[0],
            close: data.c[index]
        }));
    } catch (error) {
        console.error('Stock History Error:', error);
        return [];
    }
};
