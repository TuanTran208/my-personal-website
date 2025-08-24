<!--
=================================================================
File: src/App.vue
This is the main root component for your application.
=================================================================
-->
<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <AppHeader @toggle-dark-mode="toggleDarkMode" />

    <section id="navigation-section" class="mb-8">
      <div class="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Tool Categories</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Welcome to your central hub. Use the tabs below to filter the tools based on their category. You can mark your most-used tools with a star to have them appear in the "Favorites" tab for quick access.
        </p>
        <CategoryTabs :categories="categories" :active-category="activeCategory" @update:active-category="activeCategory = $event" />
      </div>
    </section>

    <main>
      <!-- MODIFICATION: Switched from grid to a centered flexbox layout for better alignment -->
      <div v-if="filteredTools.length > 0" class="flex flex-wrap justify-center gap-6">
        <!-- MODIFICATION: Added a wrapper with a fixed width for consistent card sizing -->
        <div v-for="tool in filteredTools" :key="tool.id" class="w-full max-w-xs sm:w-72">
          <component
            :is="tool.component"
            :tool="tool"
            :is-favorited="favorites.includes(tool.id)"
            @toggle-favorite="toggleFavorite"
          />
        </div>
      </div>
      <div v-else class="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">No tools found</h3>
        <p class="text-gray-500 dark:text-gray-400 mt-2">There are no tools in the "{{ activeCategory }}" category.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue';
import AppHeader from './components/global/AppHeader.vue';
import CategoryTabs from './components/global/CategoryTabs.vue';
import StockCard from './components/tools/StockTracker/StockCard.vue';
import NasCard from './components/tools/NasServer/NasCard.vue';
import ChatAiCard from './components/tools/ChatAi/ChatAiCard.vue';
import AiAgentCard from './components/tools/AiAgent/AiAgentCard.vue';
import UtilitiesCard from './components/tools/Utilities/UtilitiesCard.vue';
import CourseManagerCard from './components/tools/CourseManager/CourseManagerCard.vue';

const toolComponents = {
  'stock-card': StockCard,
  'nas-card': NasCard,
  'chat-ai-card': ChatAiCard,
  'ai-agent-card': AiAgentCard,
  'utilities-card': UtilitiesCard,
  'course-manager-card': CourseManagerCard,
};

const tools = ref([
  { id: 'stock-tracker', title: 'Stock Tracker', description: 'Monitor stock market performance.', category: 'Finance', icon: '📈', component: toolComponents['stock-card'] },
  { id: 'nas-server', title: 'NAS Server', description: 'Manage and access network storage.', category: 'Content & Media', icon: '🗄️', component: toolComponents['nas-card'] },
  { id: 'chat-ai', title: 'Chat to AI', description: 'Engage with an advanced AI.', category: 'AI & Productivity', icon: '🤖', component: toolComponents['chat-ai-card'] },
  { id: 'ai-agent', title: 'AI Agent', description: 'Automate tasks with a personal agent.', category: 'AI & Productivity', icon: '🧠', component: toolComponents['ai-agent-card'] },
  { id: 'utilities', title: 'Utilities', description: 'A collection of useful daily tools.', category: 'Utilities', icon: '⚙️', component: toolComponents['utilities-card'] },
  { id: 'course-manager', title: 'Course Manager', description: 'Organize your course materials.', category: 'Content & Media', icon: '📚', component: toolComponents['course-manager-card'] },
]);

const categories = ref(['All', 'Favorites', 'AI & Productivity', 'Finance', 'Utilities', 'Content & Media']);
const activeCategory = ref('All');
const favorites = ref(JSON.parse(localStorage.getItem('hubFavoritesVue')) || []);
const isDarkMode = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('hubTheme');
  isDarkMode.value = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDarkMode.value);
});

const filteredTools = computed(() => tools.value.filter(tool => {
  if (activeCategory.value === 'All') return true;
  if (activeCategory.value === 'Favorites') return favorites.value.includes(tool.id);
  return tool.category === activeCategory.value;
}));

const saveFavorites = () => localStorage.setItem('hubFavoritesVue', JSON.stringify(favorites.value));

function toggleFavorite(toolId) {
  const index = favorites.value.indexOf(toolId);
  if (index > -1) favorites.value.splice(index, 1);
  else favorites.value.push(toolId);
  saveFavorites();
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('hubTheme', isDarkMode.value ? 'dark' : 'light');
}
</script>

<style>
/* You can move these styles to a global CSS file like `src/assets/main.css` */
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
