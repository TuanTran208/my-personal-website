
<!--
=================================================================
File: src/components/tools/Utilities/UtilitiesCard.vue
=================================================================
-->
<template>
  <div @click="handleClick" :class="['utilities-card', { 'expanded': isExpanded }]">
    <UiCard :tool="tool" :is-favorited="isFavorited" @toggle-favorite="$emit('toggleFavorite', tool.id)">
      <template #footer>
        <div class="flex items-center justify-end text-sm font-medium text-blue-600 dark:text-blue-400 mt-4">
          Click to expand
          <svg class="chevron w-5 h-5 ml-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
        </div>
      </template>
      <template #expanded-content>
        <div class="utilities-content bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 px-6">
          <div class="space-y-4 my-4">
            <div class="util-item">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Convert Image</label>
              <input type="file" class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800/50"/>
            </div>
            <div class="util-item">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Download YouTube Link</label>
              <input type="text" placeholder="Paste YouTube URL" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div class="util-item">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compress File</label>
              <input type="file" class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 dark:file:bg-green-900/50 file:text-green-700 dark:file:text-green-300 hover:file:bg-green-100 dark:hover:file:bg-green-800/50"/>
            </div>
          </div>
        </div>
      </template>
    </UiCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UiCard from '../../ui/UiCard.vue';

defineProps({
  tool: Object,
  isFavorited: Boolean
});
defineEmits(['toggleFavorite']);

const isExpanded = ref(false);
const handleClick = (e) => {
  if (!e.target.closest('.favorite-btn') && !e.target.closest('.utilities-content')) {
    isExpanded.value = !isExpanded.value;
  }
};
</script>
