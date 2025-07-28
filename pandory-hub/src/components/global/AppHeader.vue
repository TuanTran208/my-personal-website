<!--
=================================================================
File: src/components/global/AppHeader.vue
=================================================================
-->
<template>
  <!-- MODIFICATION: Made header responsive to stack on mobile -->
  <header class="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4 mb-8">
    <div class="text-center sm:text-left">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">Personal Hub</h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">Your Application Control Panel</p>
    </div>
    <div class="flex items-center flex-shrink-0">
      <span class="text-sm text-gray-500 dark:text-gray-400 mr-3">Dark Mode</span>
      <label for="dark-mode-toggle" class="cursor-pointer">
        <div class="relative">
          <input type="checkbox" id="dark-mode-toggle" class="sr-only" @change="$emit('toggleDarkMode')" :checked="isDarkModeActive">
          <div class="toggle-bg block bg-gray-200 dark:bg-gray-700 w-12 h-6 rounded-full"></div>
        </div>
      </label>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
defineEmits(['toggleDarkMode']);

const isDarkModeActive = ref(document.documentElement.classList.contains('dark'));
const observer = new MutationObserver(() => {
    isDarkModeActive.value = document.documentElement.classList.contains('dark');
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
</script>