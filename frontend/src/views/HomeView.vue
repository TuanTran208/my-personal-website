<template>
  <div class="min-h-full w-full relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    
    <!-- Animated Background Elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
    <div class="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

    <!-- Main Content -->
    <div class="relative z-10 w-full px-8 py-10">
        <!-- Simplified Header for Dashboard View -->
        <header class="flex flex-col gap-6 mb-10 border-b border-gray-200 dark:border-gray-700/50 pb-6">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                        Overview
                    </h2>
                    <p class="text-gray-500 dark:text-gray-400 mt-1">
                        Welcome back to my command center.
                    </p>
                </div>
                <AuthWidget />
            </div>
            
            <div class="flex-shrink-0 w-full overflow-x-auto pb-1 hide-scrollbar">
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
import { useAuth } from '../composables/useAuth';
import CategoryTabs from '../components/global/CategoryTabs.vue';
import AuthWidget from '../components/global/AuthWidget.vue';
import StockCard from '../components/tools/StockTracker/StockCard.vue';
import NasCard from '../components/tools/NasServer/NasCard.vue';
import ChatAiCard from '../components/tools/ChatAi/ChatAiCard.vue';
import AiAgentCard from '../components/tools/AiAgent/AiAgentCard.vue';
import UtilitiesCard from '../components/tools/Utilities/UtilitiesCard.vue';
import CourseManagerCard from '../components/tools/CourseManager/CourseManagerCard.vue';
import HomeAssistantCard from '../components/tools/HomeAssistant/HomeAssistantCard.vue';
import SystemHealthCard from '../components/tools/SystemHealth/SystemHealthCard.vue';
import FoodieHubCard from '../components/tools/FoodieHub/FoodieHubCard.vue';

// Async Components (Lazy Loading) - NO, Static now for debugging
const toolComponents = {
  'stock-card': StockCard,
  'nas-card': NasCard,
  'chat-ai-card': ChatAiCard,
  'ai-agent-card': AiAgentCard,
  'utilities-card': UtilitiesCard,
  'course-manager-card': CourseManagerCard,
  'home-assistant-card': HomeAssistantCard,
  'system-health-card': SystemHealthCard,
  'foodie-hub-card': FoodieHubCard,
};

const { isOwner } = useAuth();

const tools = ref([
  { id: 'stock-tracker', title: 'Stock Tracker', description: 'Monitor stock market performance.', category: 'Finance', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />', component: toolComponents['stock-card'], requiresOwner: true },
  { id: 'nas-server', title: 'NAS Server', description: 'Manage and access network storage.', category: 'Content & Media', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />', component: toolComponents['nas-card'], requiresOwner: true },
  { id: 'chat-ai', title: 'Chat to AI', description: 'Engage with an advanced AI.', category: 'AI & Productivity', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />', component: toolComponents['chat-ai-card'], requiresOwner: false },
  { id: 'ai-agent', title: 'AI Agent', description: 'Automate tasks with a personal agent.', category: 'AI & Productivity', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />', component: toolComponents['ai-agent-card'], requiresOwner: true },
  { id: 'system-health', title: 'System Health', description: 'Monitor server resources.', category: 'Utilities', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />', component: toolComponents['system-health-card'], requiresOwner: false },
  { id: 'utilities', title: 'Utilities', description: 'A collection of useful daily tools.', category: 'Utilities', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />', component: toolComponents['utilities-card'], requiresOwner: false },
  { id: 'foodie-hub', title: 'FoodieHub', description: 'Organize food categories and restaurants.', category: 'Utilities', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 21v-7a4 4 0 014-4h8a4 4 0 014 4v7M12 10V3M8 6h8" />', component: toolComponents['foodie-hub-card'], requiresOwner: false },
  { id: 'course-manager', title: 'Course Manager', description: 'Organize my course materials.', category: 'Content & Media', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />', component: toolComponents['course-manager-card'], requiresOwner: true },
  { id: 'home-assistant', title: 'Home Assistant', description: 'Control my smart home devices.', category: 'Smart Home', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />', component: toolComponents['home-assistant-card'], requiresOwner: true },
]);

const categories = ref(['All', 'Favorites', 'AI & Productivity', 'Finance', 'Utilities', 'Content & Media', 'Smart Home']);
const activeCategory = ref('All');
const favorites = ref(JSON.parse(localStorage.getItem('hubFavoritesVue')) || []);

const filteredTools = computed(() => {
  const list = tools.value.filter(tool => {
    // Hide unauthorized tools entirely
    if (tool.requiresOwner && !isOwner.value) return false;

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
