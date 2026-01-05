<template>
  <UiCard :tool="tool" :is-favorited="isFavorited" @toggle-favorite="$emit('toggleFavorite', tool.id)">
    <div class="h-full flex flex-col justify-between" @click="fetchData">
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
      
      <div v-else-if="error" class="text-red-500 text-sm text-center py-4">
        {{ error }}
      </div>
      
      <div v-else-if="healthData" class="flex flex-col space-y-4 pt-2">
        
        <!-- CPU Status -->
        <div>
           <div class="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              <span>CPU Load</span>
              <span>{{ healthData.cpu.currentLoad.toFixed(1) }}%</span>
           </div>
           <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500" 
                :class="getColorClass(healthData.cpu.currentLoad)"
                :style="{ width: `${Math.min(healthData.cpu.currentLoad, 100)}%` }"
              ></div>
           </div>
        </div>

        <!-- Memory Status -->
        <div>
           <div class="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              <span>Memory</span>
              <span>{{ formatBytes(healthData.memory.active) }} / {{ formatBytes(healthData.memory.total) }}</span>
           </div>
           <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500" 
                :class="getColorClass((healthData.memory.active / healthData.memory.total) * 100)"
                :style="{ width: `${(healthData.memory.active / healthData.memory.total) * 100}%` }"
              ></div>
           </div>
        </div>

        <!-- Disk Status (First Disk often root) -->
        <div v-if="healthData.storage && healthData.storage.length > 0">
           <div class="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              <span>Disk ({{ healthData.storage[0].mount }})</span>
              <span>{{ healthData.storage[0].use.toFixed(0) }}%</span>
           </div>
           <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500" 
                :class="getColorClass(healthData.storage[0].use)"
                :style="{ width: `${healthData.storage[0].use}%` }"
              ></div>
           </div>
           <div class="text-[10px] text-gray-400 text-right mt-1">
              {{ formatBytes(healthData.storage[0].used) }} used of {{ formatBytes(healthData.storage[0].size) }}
           </div>
        </div>

        <div class="text-[10px] text-gray-400 text-center mt-2">
            Click to refresh
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UiCard from '../../ui/UiCard.vue';

defineProps({
  tool: Object,
  isFavorited: Boolean
});

defineEmits(['toggleFavorite']);

const loading = ref(true);
const error = ref(null);
const healthData = ref(null);

const formatBytes = (bytes, decimals = 1) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getColorClass = (percentage) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 85) return 'bg-yellow-500';
    return 'bg-red-500';
};

const fetchData = async () => {
  try {
    loading.value = true;
    // Backend is on port 3001, Vite proxies /api so this path works if proxy is set up.
    // Assuming Vite proxy is configured per project Context.
    const res = await fetch('/api/health'); 
    
    if (!res.ok) throw new Error('Failed to load system health');
    healthData.value = await res.json();
    error.value = null;
  } catch (err) {
    console.error(err);
    error.value = 'Health data unavailable';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  // Refresh every 10 seconds if visible? For now just manual refresh or on mount.
  setInterval(fetchData, 30000); // 30s auto refresh
});
</script>
