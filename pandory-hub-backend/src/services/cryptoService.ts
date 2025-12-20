
export const getCryptoDetails = async (symbol: string) => {
    // Map common symbols to USDT pairs if needed
    let pair = symbol.toUpperCase();
    if (['BTC', 'ETH', 'SOL', 'DOGE'].includes(pair)) {
        pair += 'USDT';
    }

    const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Binance API Error');
        const data = await res.json();

        return {
            symbol: symbol.toUpperCase(),
            name: `${symbol.toUpperCase()}/USDT (Crypto)`,
            sector: 'Cryptocurrency',
            price: parseFloat(data.lastPrice),
            change: parseFloat(data.priceChange),
            pctChange: parseFloat(data.priceChangePercent),
            volume: parseFloat(data.volume),
            pe: null, // N/A
            pb: null, // N/A
            currentRatio: null,
            divYield: null,
            assets: 0,
            debt: 0
        };
    } catch (error) {
        console.error('Crypto API Error:', error);
        throw error;
    }
};

export const getCryptoHistory = async (symbol: string) => {
    let pair = symbol.toUpperCase();
    if (['BTC', 'ETH', 'SOL', 'DOGE'].includes(pair)) {
        pair += 'USDT';
    }
    // Get last 30 days
    const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=30`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Binance History Error');
        const data = await res.json();

        // Binance K-line format:
        // [
        //   [
        //     1499040000000,      // Open time
        //     "0.01634790",       // Open
        //     "0.80000000",       // High
        //     "0.01575800",       // Low
        //     "0.01577100",       // Close
        //     "148976.11427815",  // Volume
        //     ...
        //   ]
        // ]

        return data.map((d: any[]) => ({
            date: new Date(d[0]).toISOString().split('T')[0],
            close: parseFloat(d[4])
        }));
    } catch (error) {
        console.error('Crypto History Error:', error);
        return [];
    }
};
