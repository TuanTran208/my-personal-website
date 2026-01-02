<template>
  <div class="flex flex-col md:flex-row min-w-screen h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
    <!-- Sidebar -->
    <SideNavigation :is-dark-mode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />

    <!-- Main Content Area -->
    <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <RouterView />
        </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SideNavigation from './components/global/SideNavigation.vue';
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

