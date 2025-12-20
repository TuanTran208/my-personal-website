
const symbol = 'FPT';
const priceUrl = `https://api-finfo.vndirect.com.vn/v4/stock_prices?q=code:${symbol}&size=1&sort=date:desc`;
const ratioUrl = `https://api-finfo.vndirect.com.vn/v4/ratios?q=code:${symbol}&size=50&sort=reportDate:desc`;
const financialUrl = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~reportType:QUARTER&size=400&sort=fiscalDate:desc`;
const profitUrl = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~itemCode:14200~reportType:QUARTER&size=40&sort=fiscalDate:desc`;

const headers = { 'User-Agent': 'Mozilla/5.0' };

async function run() {
    console.log('Testing URLs...');
    try {
        console.log('1. Price');
        const p = await fetch(priceUrl, { headers });
        if (!p.ok) console.error('Price Failed', p.status);

        console.log('2. Ratio');
        const r = await fetch(ratioUrl, { headers });
        if (!r.ok) console.error('Ratio Failed', r.status);

        console.log('3. Financial (Size 400)');
        const f = await fetch(financialUrl, { headers });
        if (!f.ok) console.error('Financial Failed', f.status);

        console.log('4. Profit');
        const pr = await fetch(profitUrl, { headers });
        if (!pr.ok) console.error('Profit Failed', pr.status, await pr.text());
        else {
            const json = await pr.json();
            console.log(`Profit Data Length: ${json.data.length}`);
        }

    } catch (e) {
        console.error('Fetch Error:', e);
    }
}
run();
