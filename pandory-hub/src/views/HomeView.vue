<template>
  <div class="min-h-full w-full relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    
    <!-- Animated Background Elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
    <div class="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

    <!-- Main Content -->
    <div class="relative z-10 w-full px-8 py-10">
        <!-- Simplified Header for Dashboard View -->
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-gray-200 dark:border-gray-700/50 pb-6">
            <div>
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                    Overview
                </h2>
                <p class="text-gray-500 dark:text-gray-400 mt-1">
                    Welcome back to my command center.
                </p>
            </div>
            
            <div class="flex-shrink-0">
                 <CategoryTabs :categories="categories" :active-category="activeCategory" @update:active-category="activeCategory = $event" />
            </div>
        </header>

        <main>
            <div v-if="filteredTools.length > 0" class="flex flex-wrap justify-center gap-6 pb-12">
                <div v-for="tool in filteredTools" :key="tool.id" class="w-full max-w-xs sm:w-80 transition-transform hover:-translate-y-1 duration-300">
                    <component 
                        :is="tool.component"
                        :tool="tool"
                        :is-favorited="favorites.includes(tool.id)"
                        @toggle-favorite="toggleFavorite"
                        class="h-full shadow-lg hover:shadow-xl dark:shadow-none dark:bg-gray-800/80 dark:backdrop-blur-md dark:border dark:border-gray-700"
                    />
                </div>
            </div>
            <div v-else class="max-w-2xl mx-auto text-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700/50">
                <div class="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">No tools found</h3>
                <p class="text-gray-500 dark:text-gray-400 mt-2">There are no tools in the "{{ activeCategory }}" category yet.</p>
            </div>
        </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CategoryTabs from '../components/global/CategoryTabs.vue';
import StockCard from '../components/tools/StockTracker/StockCard.vue';
import NasCard from '../components/tools/NasServer/NasCard.vue';
import ChatAiCard from '../components/tools/ChatAi/ChatAiCard.vue';
import AiAgentCard from '../components/tools/AiAgent/AiAgentCard.vue';
import UtilitiesCard from '../components/tools/Utilities/UtilitiesCard.vue';
import CourseManagerCard from '../components/tools/CourseManager/CourseManagerCard.vue';
import HomeAssistantCard from '../components/tools/HomeAssistant/HomeAssistantCard.vue';

// Async Components (Lazy Loading) - NO, Static now for debugging
const toolComponents = {
  'stock-card': StockCard,
  'nas-card': NasCard,
  'chat-ai-card': ChatAiCard,
  'ai-agent-card': AiAgentCard,
  'utilities-card': UtilitiesCard,
  'course-manager-card': CourseManagerCard,
  'home-assistant-card': HomeAssistantCard,
};

const tools = ref([
  { id: 'stock-tracker', title: 'Stock Tracker', description: 'Monitor stock market performance.', category: 'Finance', icon: '📈', component: toolComponents['stock-card'] },
  { id: 'nas-server', title: 'NAS Server', description: 'Manage and access network storage.', category: 'Content & Media', icon: '🗄️', component: toolComponents['nas-card'] },
  { id: 'chat-ai', title: 'Chat to AI', description: 'Engage with an advanced AI.', category: 'AI & Productivity', icon: '🤖', component: toolComponents['chat-ai-card'] },
  { id: 'ai-agent', title: 'AI Agent', description: 'Automate tasks with a personal agent.', category: 'AI & Productivity', icon: '🧠', component: toolComponents['ai-agent-card'] },
  { id: 'utilities', title: 'Utilities', description: 'A collection of useful daily tools.', category: 'Utilities', icon: '⚙️', component: toolComponents['utilities-card'] },
  { id: 'course-manager', title: 'Course Manager', description: 'Organize my course materials.', category: 'Content & Media', icon: '📚', component: toolComponents['course-manager-card'] },
  { id: 'home-assistant', title: 'Home Assistant', description: 'Control my smart home devices.', category: 'Smart Home', icon: '🏠', component: toolComponents['home-assistant-card'] },
]);

const categories = ref(['All', 'Favorites', 'AI & Productivity', 'Finance', 'Utilities', 'Content & Media', 'Smart Home']);
const activeCategory = ref('All');
const favorites = ref(JSON.parse(localStorage.getItem('hubFavoritesVue')) || []);

const filteredTools = computed(() => {
  const list = tools.value.filter(tool => {
    if (activeCategory.value === 'All') return true;
    if (activeCategory.value === 'Favorites') return favorites.value.includes(tool.id);
    return tool.category === activeCategory.value;
  });

  // Sort: Favorites first, then alphabetical (or original order)
  return list.sort((a, b) => {
    const aFav = favorites.value.includes(a.id);
    const bFav = favorites.value.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });
});

const saveFavorites = () => localStorage.setItem('hubFavoritesVue', JSON.stringify(favorites.value));

function toggleFavorite(toolId) {
  const index = favorites.value.indexOf(toolId);
  if (index > -1) favorites.value.splice(index, 1);
  else favorites.value.push(toolId);
  saveFavorites();
}
</script>
