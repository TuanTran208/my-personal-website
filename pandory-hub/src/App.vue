<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <AppHeader @toggle-dark-mode="toggleDarkMode" />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/global/AppHeader.vue';
import { ref, onMounted } from 'vue';

const isDarkMode = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('hubTheme');
  isDarkMode.value = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDarkMode.value);
});

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('hubTheme', isDarkMode.value ? 'dark' : 'light');
}
</script>

<style>
/* Global Styles */
body {
    font-family: 'Inter', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
}
.active-tab {
    @apply bg-gray-700 text-white;
}
.dark .active-tab {
    @apply bg-blue-500 text-white;
}
.inactive-tab {
    @apply bg-gray-200 text-gray-700;
}
.dark .inactive-tab {
    @apply bg-gray-700 text-gray-300;
}
.tool-card-base {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.tool-card-base:hover {
    transform: translateY(-5px);
    @apply shadow-lg;
}
.dark .tool-card-base:hover {
    @apply shadow-lg shadow-gray-900/50;
}
.favorite-btn.favorited .star-icon {
    @apply text-amber-500 fill-amber-500;
}
.utilities-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), padding 0.5s ease;
    padding-top: 0;
    padding-bottom: 0;
}
.utilities-card.expanded .utilities-content {
    max-height: 1000px;
    padding-top: 1rem;
    padding-bottom: 1rem;
}
.utilities-card.expanded .chevron {
    transform: rotate(180deg);
}
.chevron {
    transition: transform 0.3s ease;
}
.toggle-bg:after {
    content: '';
    @apply absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition shadow-sm;
}
input:checked + .toggle-bg:after {
    transform: translateX(100%);
    @apply border-white;
}
input:checked + .toggle-bg {
    @apply bg-blue-600;
}
</style>
