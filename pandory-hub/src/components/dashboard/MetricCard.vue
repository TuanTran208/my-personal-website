<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative hover:shadow-md transition-shadow">
      
    <!-- Status Indicator -->
    <div :class="['absolute top-3 right-3 w-2.5 h-2.5 rounded-full', statusColor]"></div>

    <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{{ label }}</h4>
    
    <div class="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-1">{{ value }}</div>
    
    <div class="text-xs text-gray-400 dark:text-gray-500">{{ subtext }}</div>

    <!-- Existing bottom text (Mini tooltip) -->
    <div class="mt-3 text-[10px] text-gray-400 leading-tight px-2">
        {{ tooltip }}
    </div>

    <!-- Rich Hover Popup (New) -->
    <div v-if="details" class="absolute top-2 left-2 group/info">
        <svg class="w-4 h-4 text-gray-300 hover:text-blue-500 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <!-- Popup Content -->
        <div class="invisible group-hover/info:visible opacity-0 group-hover/info:opacity-100 transition-all absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl -left-2 top-6 text-left leading-relaxed border border-gray-700 pointer-events-none">
            <div class="font-semibold text-blue-300 mb-1 border-b border-gray-700 pb-1">Chi tiết (Vietnamese)</div>
            {{ details }}
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: String,
    value: [String, Number],
    subtext: String,
    status: {
        type: String,
        default: 'neutral' // pass, fail, warning, neutral
    },
    tooltip: String,
    details: String
});

const statusColor = computed(() => {
    switch (props.status) {
        case 'pass': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
        case 'fail': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
        case 'warning': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
        default: return 'bg-gray-300';
    }
});
</script>
