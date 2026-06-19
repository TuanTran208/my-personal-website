
const symbol = 'VND';
const priceUrl = `https://api-finfo.vndirect.com.vn/v4/stock_prices?q=code:${symbol}&size=1&sort=date:desc`;
const ratioUrl = `https://api-finfo.vndirect.com.vn/v4/ratios?q=code:${symbol}&size=50&sort=reportDate:desc`;
const financialUrl = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~reportType:QUARTER&size=100&sort=fiscalDate:desc`;

// Headers are critical sometimes
const headers = { 'User-Agent': 'Mozilla/5.0' };

async function run() {
    console.log(`Checking data for ${symbol}...`);

    try {
        // Test strict filter
        const badUrl = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~itemCode:14200~reportType:QUARTER&size=10&sort=fiscalDate:desc`;
        console.log('Fetching 14200...');
        const r1 = await fetch(badUrl, { headers });
        console.log('14200 Status:', r1.status);
        const d1 = await r1.json();
        console.log('14200 Data:', d1.data.length);

        // Test Securities Profit Code (21900 or 700089)
        const goodUrl = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~itemCode:21900,700089~reportType:QUARTER&size=10&sort=fiscalDate:desc`;
        console.log('Fetching 21900,700089...');
        const r2 = await fetch(goodUrl, { headers });
        console.log('Alt Status:', r2.status);
        const d2 = await r2.json();
        console.log('Alt Data:', d2.data.length);
        if (d2.data.length > 0) console.log(d2.data[0]);

    } catch (e) {
        console.error('Error:', e.message);
    }
}
run();
