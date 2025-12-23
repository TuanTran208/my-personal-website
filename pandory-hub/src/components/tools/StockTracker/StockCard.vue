<!--
=================================================================
File: src/components/tools/StockTracker/StockCard.vue
=================================================================
-->
<template>
  <UiCard :tool="tool" :is-favorited="isFavorited" @toggle-favorite="$emit('toggleFavorite', tool.id)">
    <div class="h-full flex flex-col justify-between cursor-pointer group" @click="handleCardClick">
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="error" class="text-red-500 text-sm text-center py-4">
        {{ error }}
      </div>
      
      <div v-else class="flex flex-col space-y-4">
        <!-- VNINDEX Row -->
        <div 
            @click.stop="goToDashboard('VNINDEX')"
            class="flex items-baseline justify-between transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-700/30 rounded-lg p-2 -mx-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <div class="flex flex-col">
            <span class="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
              {{ formatNumber(latestData.close) }}
            </span>
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">VNINDEX</span>
          </div>
          
          <div :class="[
            'flex items-center space-x-1 px-2.5 py-1 rounded-full text-sm font-bold',
            isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          ]">
            <span v-if="isPositive">▲</span>
            <span v-else>▼</span>
            <span>{{ formatNumber(Math.abs(latestData.close - previousClose)) }}</span>
            <span>({{ calculatePercentageChange }}%)</span>
          </div>
        </div>

        <!-- BTC Row -->
        <div 
            v-if="btcData" 
            @click.stop="goToDashboard('BTC')"
            class="flex items-baseline justify-between transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-700/30 rounded-lg p-2 -mx-2 border-t border-gray-100 dark:border-gray-700/50 pt-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <div class="flex flex-col">
            <span class="text-xl font-bold text-yellow-600 dark:text-yellow-400 font-mono tracking-tight">
              ${{ formatNumber(btcData.price) }}
            </span>
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">BITCOIN</span>
          </div>
          
          <div :class="[
            'flex items-center space-x-1 px-2.5 py-1 rounded-full text-sm font-bold',
            btcData.change >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          ]">
             <span v-if="btcData.change >= 0">▲</span>
             <span v-else>▼</span>
             <span>{{ Math.abs(btcData.pctChange).toFixed(2) }}%</span>
          </div>
        </div>

        <!-- Expanded Content (Toggleable) - Kept mostly for VNIndex focus or could be shared -->
        <div v-if="isExpanded" class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <!-- Sparkline Area (VNINDEX) -->
            <div class="col-span-2 h-16 w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg relative overflow-hidden flex items-end">
                <svg v-if="sparklinePath" class="w-full h-full" preserveAspectRatio="none">
                <path :d="sparklineFill" :class="isPositive ? 'fill-green-100 dark:fill-green-900/20' : 'fill-red-100 dark:fill-red-900/20'" />
                <path :d="sparklinePath" :class="isPositive ? 'stroke-green-500' : 'stroke-red-500'" fill="none" stroke-width="2" vector-effect="non-scaling-stroke" />
                </svg>
                <span v-else class="text-xs text-gray-400 w-full text-center mb-6">Not enough data for chart</span>
            </div>
            
            <div class="text-xs text-gray-400 text-right mt-2">
                Last updated: {{ formatTime(latestData.timestamp) }}
            </div>
        </div>

        <!-- Expand Toggle Button -->
        <div class="flex justify-center pt-2">
            <button 
                @click.stop="toggleExpand" 
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Toggle Details"
            >
                <svg :class="['w-5 h-5 transition-transform duration-200', isExpanded ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import UiCard from '../../ui/UiCard.vue';

defineProps({
  tool: Object,
  isFavorited: Boolean
});

defineEmits(['toggleFavorite']);

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const history = ref([]);
const btcData = ref(null); // Store BTC details
const isExpanded = ref(false);

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};

const goToDashboard = (symbol) => {
    // If VNINDEX, maybe just go to dashboard or handle specifically if we have index data support there
    // For now, let's assume we want to search for it.
    router.push({ path: '/stock-dashboard', query: { symbol } });
};

const handleCardClick = () => {
    // Default fallback if clicked elsewhere on the card
    router.push('/stock-dashboard');
};

const latestData = computed(() => {
    if (history.value.length === 0) return null;
    return history.value[history.value.length - 1]; 
});

const previousClose = computed(() => {
    if (history.value.length < 2) return latestData.value?.open || 0;
    return history.value[history.value.length - 2].close;
});

const isPositive = computed(() => {
    if (!latestData.value) return false;
    return latestData.value.close >= previousClose.value;
});

const calculatePercentageChange = computed(() => {
    if (!latestData.value || previousClose.value === 0) return '0.00';
    const change = latestData.value.close - previousClose.value;
    return ((change / previousClose.value) * 100).toFixed(2);
});

const sparklinePath = computed(() => {
    if (history.value.length < 2) return '';
    const data = history.value.slice(-20);
    if (data.length < 2) return '';
    const min = Math.min(...data.map(d => d.close));
    const max = Math.max(...data.map(d => d.close));
    const range = max - min || 1;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.close - min) / range) * 80 - 10; 
        return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
});

const sparklineFill = computed(() => {
    if (!sparklinePath.value) return '';
    return `${sparklinePath.value} V 100 H 0 Z`;
});

const formatNumber = (num) => {
    if (num === undefined || num === null) return '---';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000); 
    return date.toLocaleDateString([], { month: '2-digit', day: '2-digit' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Fetch data
const fetchData = async () => {
  try {
    loading.value = true;
    
    // Parallel fetch: VNIndex History + BTC Details
    const [vnRes, btcRes] = await Promise.all([
        fetch('http://localhost:3001/api/vnindex'),
        fetch('http://localhost:3001/api/stock-details/BTC')
    ]);

    if (!vnRes.ok) throw new Error('Failed to load VNIndex');
    history.value = await vnRes.json();

    if (btcRes.ok) {
        btcData.value = await btcRes.json();
    }
  } catch (err) {
    console.error(err);
    error.value = 'Data unavailable';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

