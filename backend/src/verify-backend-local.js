
async function run() {
    try {
        console.log('Fetching FPT from localhost:3001...');
        const res = await fetch('http://localhost:3001/api/stock-details/FPT');
        if (res.ok) {
            const data = await res.json();
            console.log('Success!');
            console.log('Symbol:', data.symbol);
            console.log('Growth:', data.epsGrowth);
            console.log('Stability:', data.earningStability);
        } else {
            console.error('Failed:', res.status, res.statusText);
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}
run();
