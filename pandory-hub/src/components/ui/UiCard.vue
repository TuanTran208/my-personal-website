
<!--
=================================================================
File: src/components/ui/UiCard.vue
=================================================================
-->
<template>
  <div class="tool-card-base bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200/80 dark:border-gray-700/80 overflow-hidden flex flex-col h-full">
    <div class="p-6 flex-grow flex flex-col cursor-pointer">
      <div class="flex justify-between items-start mb-4">
        <div class="text-4xl">{{ tool.icon }}</div>
        <button @click.stop="$emit('toggleFavorite', tool.id)" :class="['favorite-btn p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors', { 'favorited': isFavorited }]">
          <svg class="star-icon w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </button>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{{ tool.title }}</h3>
      <p class="text-gray-600 dark:text-gray-400 flex-grow">{{ tool.description }}</p>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
    <slot name="expanded-content"></slot>
  </div>
</template>

<script setup>
defineProps({
  tool: Object,
  isFavorited: Boolean
});
defineEmits(['toggleFavorite']);
</script>
