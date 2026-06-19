
const symbol = 'FPT';
const url = `https://api-finfo.vndirect.com.vn/v4/ratios?q=code:${symbol}&size=100&sort=reportDate:desc`; // Increased size to 100
const headers = { 'User-Agent': 'Mozilla/5.0' };

async function run() {
    try {
        const res = await fetch(url, { headers });
        const json = await res.json();
        const data = json.data || [];

        console.log(`Found ${data.length} ratio items.`);

        // Group by itemName/ratioCode to see available metrics
        const metrics = {};
        data.forEach(item => {
            const key = `${item.ratioCode} (${item.itemCode})`;
            if (!metrics[key]) {
                metrics[key] = { name: item.itemName, value: item.value, date: item.reportDate };
            }
        });

        console.log('--- All Available Ratios ---');
        Object.entries(metrics).forEach(([key, val]) => {
            // Print only if value is non-zero to reduce noise, or just print all
            console.log(`${key}: ${val.name} = ${val.value} (${val.date})`);
        });

    } catch (e) {
        console.error(e);
    }
}
run();
