<!--
=================================================================
File: src/components/tools/StockTracker/StockCard.vue
=================================================================
-->
<template>
  <UiCard :tool="tool" :is-favorited="isFavorited" @toggle-favorite="$emit('toggleFavorite', tool.id)">
    <div class="h-full flex flex-col justify-between">
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="error" class="text-red-500 text-sm text-center py-4">
        {{ error }}
      </div>
      
      <div v-else class="flex flex-col space-y-4">
        <!-- Main Value Display -->
        <div class="flex items-baseline justify-between">
          <div class="flex flex-col">
            <span class="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
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
            <span>{{ formatNumber(latestData.close - previousClose) }}</span>
            <span>({{ calculatePercentageChange }}%)</span>
          </div>
        </div>

        <!-- Additional Data Points (High/Low/Vol) -->
        <div class="grid grid-cols-2 gap-4 text-sm mt-2">
           <div class="flex flex-col p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
             <span class="text-gray-500 dark:text-gray-400 text-xs mb-1">High</span>
             <span class="font-semibold dark:text-gray-200">{{ formatNumber(latestData.high) }}</span>
           </div>
           <div class="flex flex-col p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
             <span class="text-gray-500 dark:text-gray-400 text-xs mb-1">Low</span>
             <span class="font-semibold dark:text-gray-200">{{ formatNumber(latestData.low) }}</span>
           </div>
           
           <!-- Sparkline Area -->
           <div class="col-span-2 h-16 w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg relative overflow-hidden flex items-end">
             <svg v-if="sparklinePath" class="w-full h-full" preserveAspectRatio="none">
               <path :d="sparklineFill" :class="isPositive ? 'fill-green-100 dark:fill-green-900/20' : 'fill-red-100 dark:fill-red-900/20'" />
               <path :d="sparklinePath" :class="isPositive ? 'stroke-green-500' : 'stroke-red-500'" fill="none" stroke-width="2" vector-effect="non-scaling-stroke" />
             </svg>
             <span v-else class="text-xs text-gray-400 w-full text-center mb-6">Not enough data for chart</span>
           </div>

           <div class="col-span-2 flex flex-col p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
             <span class="text-gray-500 dark:text-gray-400 text-xs mb-1">Volume</span>
             <span class="font-semibold dark:text-gray-200">{{ formatVolume(latestData.volume) }}</span>
           </div>
        </div>
        
        <div class="text-xs text-gray-400 text-right mt-2">
            Last updated: {{ formatTime(latestData.timestamp) }}
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import UiCard from '../../ui/UiCard.vue';

defineProps({
  tool: Object,
  isFavorited: Boolean
});

defineEmits(['toggleFavorite']);

const loading = ref(true);
const error = ref(null);
const history = ref([]);

const latestData = computed(() => {
    if (history.value.length === 0) return null;
    return history.value[history.value.length - 1]; // Last item is latest
});

const previousClose = computed(() => {
    if (history.value.length < 2) return latestData.value?.open || 0; // Fallback to open if no previous history
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
    
    // Take last 20 points for better visual
    const data = history.value.slice(-20);
    if (data.length < 2) return '';

    const min = Math.min(...data.map(d => d.close));
    const max = Math.max(...data.map(d => d.close));
    const range = max - min || 1;
    
    // Dimensions: assume 100x100 coordinate space for simplicity
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.close - min) / range) * 80 - 10; // Padding 10
        return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
});

const sparklineFill = computed(() => {
    if (!sparklinePath.value) return '';
    return `${sparklinePath.value} V 100 H 0 Z`;
});

// Format numbers with commas (e.g. 1,234.56)
const formatNumber = (num) => {
    if (num === undefined || num === null) return '---';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
};

const formatVolume = (num) => {
    if (num === undefined || num === null) return '---';
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    // API returns seconds, check if it needs milliseconds conversion. 
    // Usually if it's small (10 digits) it's seconds. Today's timestamp is ~1.7e9.
    const date = new Date(timestamp * 1000); 
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Fetch data from our backend
const fetchData = async () => {
  try {
    loading.value = true;
    // Assuming backend is running on localhost:3001
    const response = await fetch('http://localhost:3001/api/vnindex');
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();
    history.value = data;
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

