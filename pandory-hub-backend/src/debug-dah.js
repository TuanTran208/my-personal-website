
const symbol = 'DAH';
const url = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~reportType:QUARTER&size=200&sort=fiscalDate:desc`;
const headers = { 'User-Agent': 'Mozilla/5.0' };

async function run() {
    try {
        const res = await fetch(url, { headers });
        const json = await res.json();
        const data = json.data || [];

        if (data.length > 0) {
            const latestDate = data[0].fiscalDate;
            console.log(`Latest Date: ${latestDate}`);
            const items = data.filter(i => i.fiscalDate === latestDate);
            items.sort((a, b) => b.numericValue - a.numericValue);

            console.log('--- All Items (DAH) ---');
            items.forEach(i => {
                console.log(`Code: ${i.itemCode}, Value: ${i.numericValue.toLocaleString()}`);
            });
        }
    } catch (e) {
        console.error(e);
    }
}
run();
