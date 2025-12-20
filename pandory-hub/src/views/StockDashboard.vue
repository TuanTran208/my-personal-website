<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 font-inter">
    <!-- Header / Navigation -->
    <header class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          <span class="text-blue-600 dark:text-blue-400">Graham</span> & Buffett Tracker
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Rational Investing based on Fundamental Value</p>
      </div>

      <!-- Search with Autocomplete -->
      <div class="relative w-full md:w-96">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg v-if="!loading" class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
           <svg v-else class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <input 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text" 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow dark:text-white" 
          placeholder="Search Ticker (e.g. FPT, VNM)..." 
        />
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- LEFT SIDEBAR: Principles Reminder -->
      <aside class="lg:col-span-3 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 dark:border-gray-700">Defensive Investor</h3>
          <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li class="flex items-start">
              <span class="mr-2 text-green-500">✔</span>
              <span><strong>Prioritize Logic:</strong> Avoid emotional decisions based on short-term noise.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2 text-green-500">✔</span>
              <span><strong>Margin of Safety:</strong> Price < Intrinsic Value.</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2 text-green-500">✔</span>
              <span><strong>Consistency:</strong> long-term earnings & dividends history.</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm p-6 border border-red-100 dark:border-red-900/30">
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-4 border-b border-red-200 dark:border-red-800 pb-2">Risk: Speculation</h3>
          <p class="text-sm text-red-700 dark:text-red-300 leading-relaxed">
            Betting on price movements rather than fundamental business value is speculation. This dashboard flags such risks.
          </p>
        </div>

        <!-- MY PORTFOLIO (New) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
           <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 dark:border-gray-700 flex justify-between items-center">
             <span>My Portfolio</span>
             <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Beta</span>
           </h3>
           <div class="space-y-4">
             <!-- Mock Portfolio Item 1 -->
             <div class="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors" @click="fetchStockData('FPT')">
               <div>
                  <div class="font-bold text-gray-900 dark:text-white">FPT</div>
                  <div class="text-xs text-gray-500">Avg: 90.5</div>
               </div>
               <div class="text-right">
                  <div class="font-mono text-sm text-gray-800 dark:text-gray-200">136,500</div>
                  <div class="text-xs font-bold text-green-500">+50.8%</div>
               </div>
             </div>
              <!-- Mock Portfolio Item 2 -->
             <div class="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors" @click="fetchStockData('MWG')">
               <div>
                  <div class="font-bold text-gray-900 dark:text-white">MWG</div>
                  <div class="text-xs text-gray-500">Avg: 45.0</div>
               </div>
               <div class="text-right">
                  <div class="font-mono text-sm text-gray-800 dark:text-gray-200">42,800</div>
                  <div class="text-xs font-bold text-red-500">-4.2%</div>
               </div>
             </div>
             <!-- Mock Portfolio Item 3 -->
              <div class="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors" @click="fetchStockData('BTC')">
               <div>
                  <div class="font-bold text-gray-900 dark:text-white">BTC</div>
                  <div class="text-xs text-gray-500">Crypto</div>
               </div>
               <div class="text-right">
                  <div class="font-mono text-sm text-gray-800 dark:text-gray-200">$98,500</div>
                  <div class="text-xs font-bold text-green-500">+12.4%</div>
               </div>
             </div>
           </div>
           <button class="w-full mt-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
             + Add Holding
           </button>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="lg:col-span-9 space-y-8">
        
        <!-- Stock Title & Price Header -->
        <section class="flex justify-between items-end bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              {{ currentStock.symbol }}
              <span class="text-sm font-normal px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{{ currentStock.name }}</span>
            </h2>
            <div class="mt-2 text-gray-500 dark:text-gray-400 text-sm">Sector: {{ currentStock.sector }}</div>
          </div>
          <div class="text-right">
            <div class="text-4xl font-mono font-bold text-gray-900 dark:text-white">{{ formatNumber(currentStock.price) }}</div>
            <div :class="['text-sm font-semibold mt-1 flex justify-end items-center gap-1', currentStock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']">
              <span v-if="currentStock.change >= 0">▲</span><span v-else>▼</span>
              {{ Math.abs(currentStock.change) }} ({{ currentStock.pctChange }}%)
            </div>
            <div class="text-xs text-gray-400 mt-1">Vol: {{ formatVolume(currentStock.volume) }}</div>
          </div>
        </section>

        <!-- CHART AREA -->
        <div v-if="stockHistory.length > 0" class="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Price History (30 Days)</div>
            <StockChart :history="stockHistory" :is-positive="currentStock.change >= 0" />
        </div>

        <!-- BENJAMIN GRAHAM SCORECARD -->
        <section v-if="!isCrypto" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <!-- P/E RATIO -->
          <MetricCard
            label="P/E Ratio"
            :value="currentStock.pe ? currentStock.pe.toFixed(2) : '---'"
            subtext="Target: < 15"
            :status="currentStock.pe > 0 && currentStock.pe < 15 ? 'pass' : 'warning'"
            tooltip="Giá/Thu Nhập (P/E). Thấp hơn 15 thường là tốt cho đầu tư giá trị (mua chụm). Đo lường số năm hoàn vốn."
            details="CT: P/E = Giá thị trường / Lợi nhuận mỗi cổ phiếu (EPS). Cho biết nhà đầu tư sẵn sàng trả bao nhiêu cho 1 đồng lợi nhuận."
          />

          <!-- P/B RATIO -->
          <MetricCard
            label="P/B Ratio"
            :value="currentStock.pb ? currentStock.pb.toFixed(2) : '---'"
            subtext="Target: < 1.5"
            :status="currentStock.pb > 0 && currentStock.pb < 1.5 ? 'pass' : 'warning'"
            tooltip="Giá/Sổ Sách (P/B). So sánh giá thị trường với giá trị sổ sách. Không nên vượt quá 1.5 lần."
            details="CT: P/B = Giá thị trường / (Tổng vốn chủ sở hữu / Tổng số CP). Nếu P/B báo 0, hệ thống tự tính: (Giá * Số CP) / Vốn CSH."
          />

          <!-- GRAHAM MULTIPLIER -->
          <MetricCard
            label="Graham Multiplier"
            :value="grahamMultiplier"
            subtext="Target: < 22.5"
            :status="grahamMultiplier > 0 && grahamMultiplier < 22.5 ? 'pass' : 'warning'"
            tooltip="Chỉ số Graham < 22.5 là dấu hiệu cổ phiếu đang được định giá rẻ. Kết hợp P/E và P/B."
            details="CT: Tích số Graham = P/E * P/B. Theo Benjamin Graham, tích số này không nên vượt quá 22.5 để đảm bảo an toàn vốn."
          />

          <!-- CURRENT RATIO -->
          <MetricCard
            label="Current Ratio"
            :value="currentStock.currentRatio ? currentStock.currentRatio.toFixed(2) : '---'"
            subtext="Target: > 2.0"
            :status="currentStock.currentRatio > 2.0 ? 'pass' : 'warning'"
            tooltip="Current Assets / Current Liabilities. Indicates ability to pay short-term debts."
            details="CT: Tỷ số thanh toán hiện hành = Tài sản ngắn hạn / Nợ ngắn hạn. Đo lường khả năng trả nợ ngay lập tức."
          />
        </section>

        <!-- FINANCIAL STABILITY & STRENGTH -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="font-semibold text-gray-800 dark:text-gray-200">Financial Strength</h3>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded px-1.5 py-0.5 space-x-1.5">
                             <button 
                                @click="isVietnamese = false"
                                :class="['text-[10px] font-bold transition-colors', !isVietnamese ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600']"
                                title="View on BSC (English)"
                             >EN</button>
                             <span class="text-[10px] text-gray-300">|</span>
                             <button 
                                @click="isVietnamese = true"
                                :class="['text-[10px] font-bold transition-colors', isVietnamese ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600']"
                                title="View on DStock (Vietnamese)"
                             >VN</button>
                        </div>
                        <div class="flex space-x-3">
                            <a :href="financialLink" target="_blank" class="text-xs text-gray-400 hover:text-blue-500 cursor-pointer hover:underline transition-colors">Financials</a>
                            <a :href="overviewLink" target="_blank" class="text-xs text-blue-500 cursor-pointer hover:underline font-medium">Overview</a>
                        </div>
                    </div>
                </div>
                <div class="p-6 space-y-4">
                    <div class="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-700/50">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Total Assets</span>
                        <span class="font-mono text-gray-900 dark:text-gray-200">{{ formatNumber(currentStock.assets) }}</span>
                    </div>
                    <div class="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-700/50">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Total Debt</span>
                        <span class="font-mono text-gray-900 dark:text-gray-200">{{ formatNumber(currentStock.debt) }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Net Working Capital</span>
                        <span :class="['font-mono font-semibold', currentStock.assets - currentStock.debt > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600']">
                            {{ formatNumber(currentStock.assets - currentStock.debt) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- DIVIDEND & EARNINGS -->
             <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="font-semibold text-gray-800 dark:text-gray-200">Earnings & Dividend Stability</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="flex items-center justify-between">
                         <span class="text-sm text-gray-600 dark:text-gray-400">3-Year Positive Earnings</span>
                         <span v-if="currentStock.earningStability" class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PASS</span>
                         <span v-else class="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">FAIL</span>
                    </div>
                    <div class="flex items-center justify-between">
                         <span class="text-sm text-gray-600 dark:text-gray-400">Dividend Yield (>0%)</span>
                         <span v-if="currentStock.dividendStability" class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PASS</span>
                         <span v-else class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">NONE</span>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Net Profit Growth (YoY)</span>
                        <span :class="['font-mono font-bold', currentStock.epsGrowth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600']">
                            {{ currentStock.epsGrowth ? (currentStock.epsGrowth > 0 ? '+' : '') + currentStock.epsGrowth.toFixed(2) + '%' : '---' }}
                        </span>
                    </div>
                     <p class="text-xs text-gray-400 italic mt-2">Stability based on recent 12 quarters profit & current dividend yield.</p>
                </div>
            </div>
        </section>

        <!-- PAIRWISE COMPARISON -->
        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Pairwise Comparison</h3>
            <div class="grid grid-cols-3 gap-4 text-sm">
                <!-- Labels -->
                 <div class="col-span-1 pt-12 space-y-4 text-gray-500 dark:text-gray-400 font-medium">
                     <div class="h-8 flex items-center">P/E Ratio</div>
                     <div class="h-8 flex items-center">P/B Ratio</div>
                     <div class="h-8 flex items-center">Current Ratio</div>
                     <div class="h-8 flex items-center">Dividend Yield</div>
                 </div>
                 
                 <!-- Stock A -->
                 <div class="col-span-1 border-l pl-4 dark:border-gray-700">
                     <div class="font-bold text-center mb-4 text-lg text-blue-600">{{ currentStock.symbol }}</div>
                     <div class="space-y-4 text-gray-800 dark:text-gray-200 font-mono">
                         <div class="h-8 flex items-center">{{ currentStock.pe }}</div>
                         <div class="h-8 flex items-center">{{ currentStock.pb }}</div>
                         <div class="h-8 flex items-center">{{ currentStock.currentRatio }}</div>
                         <div class="h-8 flex items-center">{{ currentStock.divYield }}%</div>
                     </div>
                 </div>

                 <!-- Stock B (Comparison) -->
                 <div class="col-span-1 border-l pl-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20 rounded-r-lg">
                     <div class="text-center mb-4">
                         <select class="bg-transparent font-bold text-lg text-gray-600 dark:text-gray-300 border-none focus:ring-0 cursor-pointer">
                             <option>VNM</option>
                             <option>HPG</option>
                             <option>VCB</option>
                         </select>
                     </div>
                     <div class="space-y-4 text-gray-600 dark:text-gray-400 font-mono opacity-75">
                         <!-- Mock data for comparison -->
                         <div class="h-8 flex items-center">18.4</div>
                         <div class="h-8 flex items-center">3.2</div>
                         <div class="h-8 flex items-center">1.4</div>
                         <div class="h-8 flex items-center">2.1%</div>
                     </div>
                 </div>
            </div>
        </section>

      </main>
    </div>

    <!-- Error Toast -->
    <div v-if="error" class="fixed top-24 right-6 max-w-sm w-full bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-xl rounded-r-lg overflow-hidden animate-in slide-in-from-right duration-300 z-50">
        <div class="p-4 flex items-start">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Error Fetching Data</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
                <button @click="error = null" class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span class="sr-only">Close</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import MetricCard from '../components/dashboard/MetricCard.vue';
import StockChart from '../components/dashboard/StockChart.vue';

const route = useRoute();
const searchQuery = ref('');
const loading = ref(false);
const error = ref(null);
const stockHistory = ref([]);

// Default state or null
const currentStock = ref({
    symbol: '---',
    name: '---',
    sector: '---',
    price: 0,
    change: 0,
    pctChange: 0,
    volume: 0,
    pe: 0,
    pb: 0,
    currentRatio: 0,
    assets: 0,
    debt: 0,
    divYield: 0
});

const isCrypto = computed(() => {
    return currentStock.value.sector === 'Cryptocurrency';
});

const isVietnamese = ref(false); // Default to English as initially requested



const overviewLink = computed(() => {
    const sym = currentStock.value.symbol.toUpperCase();
    return isVietnamese.value 
        ? `https://dstock.vndirect.com.vn/tong-quan/${sym}`
        : `https://www.bsc.com.vn/en/company/overview/${sym.toLowerCase()}/`;
});

const financialLink = computed(() => {
    const sym = currentStock.value.symbol.toUpperCase();
    return isVietnamese.value 
        ? `https://dstock.vndirect.com.vn/bang-can-doi-ke-toan/${sym}`
        : `https://www.bsc.com.vn/en/company/financial-statement/${sym.toLowerCase()}/`;
});

const chartLink = computed(() => {
    const sym = currentStock.value.symbol.toUpperCase();
    return isVietnamese.value 
        ? `https://dstock.vndirect.com.vn/lich-su-gia/${sym}`
        : `https://www.bsc.com.vn/en/company/overview/${sym.toLowerCase()}/`; // BSC combines overview/chart
});

const profileLink = computed(() => {
    const sym = currentStock.value.symbol.toUpperCase();
    return isVietnamese.value 
        ? `https://dstock.vndirect.com.vn/ho-so-doanh-nghiep/${sym}`
        : `https://www.bsc.com.vn/en/company/overview/${sym.toLowerCase()}/`;
});

const grahamMultiplier = computed(() => {
    const pe = currentStock.value.pe;
    const pb = currentStock.value.pb;
    if (pe && pb) {
        return (pe * pb).toFixed(2);
    }
    return 0;
});

const formatNumber = (num) => {
    if (num === undefined || num === null) return '---';
    return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(num);
};

const formatVolume = (num) => {
    if (!num) return '---';
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
};

const fetchStockData = async (symbol) => {
    if (!symbol) return;
    loading.value = true;
    error.value = null;
    stockHistory.value = [];
    
    try {
        // Parallel Fetch: Details + History
        const [detailRes, histRes] = await Promise.all([
            fetch(`http://localhost:3001/api/stock-details/${symbol}`),
            fetch(`http://localhost:3001/api/stock-history/${symbol}`)
        ]);

        if (!detailRes.ok) throw new Error('Stock not found');
        
        const data = await detailRes.json();
        currentStock.value = data;

        if (histRes.ok) {
            stockHistory.value = await histRes.json();
        }
    } catch (err) {
        console.error(err);
        error.value = 'Could not fetch data for ' + symbol;
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    if (searchQuery.value) {
        fetchStockData(searchQuery.value);
    }
};

onMounted(() => {
    const symbol = route.query.symbol || 'FPT';
    searchQuery.value = symbol;
    fetchStockData(symbol);
});
</script>
