<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div v-if="filteredTools.length > 0" class="flex flex-wrap justify-center gap-6">
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
import { ref, computed } from 'vue';
import CategoryTabs from '../components/global/CategoryTabs.vue';
import StockCard from '../components/tools/StockTracker/StockCard.vue';
import NasCard from '../components/tools/NasServer/NasCard.vue';
import ChatAiCard from '../components/tools/ChatAi/ChatAiCard.vue';
import AiAgentCard from '../components/tools/AiAgent/AiAgentCard.vue';
import UtilitiesCard from '../components/tools/Utilities/UtilitiesCard.vue';
import CourseManagerCard from '../components/tools/CourseManager/CourseManagerCard.vue';
import HomeAssistantCard from '../components/tools/HomeAssistant/HomeAssistantCard.vue';

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
  { id: 'course-manager', title: 'Course Manager', description: 'Organize your course materials.', category: 'Content & Media', icon: '📚', component: toolComponents['course-manager-card'] },
  { id: 'home-assistant', title: 'Home Assistant', description: 'Control your smart home devices.', category: 'Smart Home', icon: '🏠', component: toolComponents['home-assistant-card'] },
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
