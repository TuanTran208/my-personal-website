
const symbol = 'FPT';
// Fetching more items to be sure
const url = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~reportType:QUARTER~modelType:1,33&size=200&sort=fiscalDate:desc`;
const headers = { 'User-Agent': 'Mozilla/5.0' };

async function run() {
    try {
        const res = await fetch(url, { headers });
        const json = await res.json();
        const latestDate = json.data[0].fiscalDate;
        console.log(`Latest Date: ${latestDate}`);

        // Filter only latest quarter
        const items = json.data.filter(i => i.fiscalDate === latestDate);

        // Sort by value to find big numbers
        items.sort((a, b) => b.numericValue - a.numericValue);

        items.forEach(i => {
            console.log(`Code: ${i.itemCode}, Value: ${i.numericValue.toLocaleString()}`);
        });
    } catch (e) {
        console.error(e);
    }
}
run();
