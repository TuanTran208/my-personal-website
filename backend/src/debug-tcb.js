
const symbol = 'TCB';
// Banks might use different modelTypes? usually 1 is General, 2 is Bank?, 3 is Insurance?, 4 is Securities?
// Let's try to fetch without modelType filter or allow multiple to see what comes back.
// But API requires modelType usually. Let's try broad fetch.
const url = `https://api-finfo.vndirect.com.vn/v4/financial_statements?q=code:${symbol}~reportType:QUARTER&size=100&sort=fiscalDate:desc`;
const headers = { 'User-Agent': 'Mozilla/5.0' };

async function run() {
    try {
        const res = await fetch(url, { headers });
        const json = await res.json();
        const data = json.data || [];

        console.log(`Found ${data.length} items for ${symbol}.`);

        if (data.length > 0) {
            const latestDate = data[0].fiscalDate;
            console.log(`Latest Date: ${latestDate}`);

            // Filter latest
            const items = data.filter(i => i.fiscalDate === latestDate);
            // Sort by value
            items.sort((a, b) => b.numericValue - a.numericValue);

            console.log('--- Top Values (Potential Assets/Liabilities) ---');
            items.slice(0, 15).forEach(i => {
                console.log(`Code: ${i.itemCode} (Model: ${i.modelType}), Value: ${i.numericValue.toLocaleString()}`);
            });

            console.log('--- Searching for Keywords ---');
            // Try to assume standard bank codes (Assets often start with 2, Liabilities with 3?)
            items.forEach(i => {
                if (i.itemCode.toString().startsWith('27') || i.itemCode.toString().startsWith('30') || i.itemCode === 12700 || i.itemCode === 13000) {
                    console.log(`Potential Match: Code ${i.itemCode}, Value: ${i.numericValue.toLocaleString()}`);
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
}
run();
