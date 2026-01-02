<template>
  <aside 
    class="hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen transition-all duration-300 relative"
    :class="[isCollapsed ? 'w-20' : 'w-64']"
  >
    <!-- Collapse Toggle Button -->
    <button 
        @click="toggleCollapse"
        class="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm z-50 transform hover:scale-110 transition-transform"
        :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
    >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    </button>

    <!-- Brand -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700/50 overflow-hidden whitespace-nowrap">
        <div class="flex items-center gap-3 text-blue-600 dark:text-blue-400 transition-all duration-300">
            <img src="/favicon_bg_rm.png" alt="Pandory Hub Logo" class="w-8 h-8 flex-shrink-0" />
            <span 
                class="text-xl font-bold tracking-tight transition-opacity duration-300"
                :class="[isCollapsed ? 'opacity-0 w-0' : 'opacity-100']"
            >
                Pandory Hub
            </span>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1">
        <router-link to="/" 
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap group relative"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Overview</span>
            
            <!-- Tooltip implementation for collapsed mode -->
            <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                Overview
            </div>
        </router-link>

        <div class="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider transition-opacity duration-300 whitespace-nowrap overflow-hidden"
             :class="[isCollapsed ? 'opacity-0 h-0 p-0' : 'opacity-100']"
        >
            Workspaces
        </div>

        <div v-if="isCollapsed" class="h-4"></div> <!-- Spacer when header hidden -->

        <router-link to="/utilities-dashboard" 
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap group relative"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Utilities</span>
             <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                Utilities
            </div>
        </router-link>

        <router-link to="/stock-dashboard" 
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap group relative"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Market Tracker</span>
             <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                Market Tracker
            </div>
        </router-link>

        <div class="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider transition-opacity duration-300 whitespace-nowrap overflow-hidden"
             :class="[isCollapsed ? 'opacity-0 h-0 p-0' : 'opacity-100']"
        >
            Services
        </div>

        <!-- Home Assistant -->
        <a href="http://home.pandory.me" target="_blank"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap group relative"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Home Assistant</span>
             <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                Home Assistant
            </div>
        </a>

        <!-- NasServer -->
        <a href="http://nas.pandory.me" target="_blank"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap group relative"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">NAS Server</span>
             <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                NAS Server
            </div>
        </a>
    </nav>

    <!-- Footer / Settings -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <!-- Dark Mode Toggle -->
        <button 
            @click="$emit('toggleDarkMode')"
            class="flex items-center w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative"
            :class="[isCollapsed ? 'justify-center' : 'justify-between']"
        >
            <div class="flex items-center gap-3">
                <svg v-if="!isDarkMode" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span :class="[isCollapsed ? 'hidden' : 'block']">{{ isDarkMode ? 'Dark' : 'Light' }}</span>
            </div>
            
            <div 
                v-if="!isCollapsed"
                class="relative w-8 h-4 bg-gray-200 dark:bg-gray-600 rounded-full transition-colors"
                :class="[isCollapsed ? 'hidden' : 'block']" 
            >
                 <div :class="['absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform', isDarkMode ? 'translate-x-4' : '']"></div>
            </div>
             <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                Toggle Theme
            </div>
        </button>
        
        <!-- About Me Button -->
        <button 
            @click="showAboutModal = true"
            class="flex items-center w-full px-3 py-2 mt-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group relative"
            :class="[isCollapsed ? 'justify-center' : 'justify-start']"
        >
             <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <span :class="[isCollapsed ? 'hidden' : 'block ml-3']">About Me</span>
             
             <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                About Me
            </div>
        </button>
    </div>
  </aside>
  
  <!-- Mobile Header (Visible only on mobile) -->
  <header class="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 relative">
      <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
         <img src="/favicon_bg_rm.png" alt="Pandory Hub Logo" class="w-8 h-8" />
         <span class="font-bold text-lg">Pandory Hub</span>
      </div>
      <button 
        @click="toggleMobileMenu"
        class="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
      </button>
  </header>

  <!-- Mobile Navigation Menu (Overlay) -->
  <div v-show="isMobileMenuOpen" class="md:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm" @click="isMobileMenuOpen = false"></div>
  
  <aside 
    class="md:hidden fixed top-[60px] left-0 right-0 bottom-0 z-40 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 overflow-y-auto"
    :class="[isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full']"
  >
    <nav class="flex flex-col p-4 space-y-2">
        <router-link to="/" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Overview</span>
        </router-link>

        <div class="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Workspaces
        </div>

        <router-link to="/utilities-dashboard" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Utilities</span>
        </router-link>

        <router-link to="/stock-dashboard" @click="isMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
        >
             <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Market Tracker</span>
        </router-link>

        <div class="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Services
        </div>

        <a href="http://home.pandory.me" target="_blank"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home Assistant</span>
        </a>

        <a href="http://nas.pandory.me" target="_blank"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
             <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <span>NAS Server</span>
        </a>

        <div class="border-t border-gray-100 dark:border-gray-700 my-2"></div>

        <!-- Dark Mode Toggle Mobile -->
        <button 
            @click="$emit('toggleDarkMode')"
            class="flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
             <div class="flex items-center gap-3">
                <svg v-if="!isDarkMode" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</span>
            </div>
            <div class="relative w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full transition-colors">
                  <div :class="['absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform', isDarkMode ? 'translate-x-4' : '']"></div>
            </div>
        </button>

        
        <!-- About Me Mobile -->
        <button 
            @click="showAboutModal = true; isMobileMenuOpen = false"
            class="flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
             <div class="flex items-center gap-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About Me</span>
            </div>
        </button>
    </nav>
    <AboutModal :is-open="showAboutModal" @close="showAboutModal = false" />
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import AboutModal from './AboutModal.vue';

defineProps({
    isDarkMode: Boolean
});

defineEmits(['toggleDarkMode']);

const isCollapsed = ref(false);
const isMobileMenuOpen = ref(false);
const showAboutModal = ref(false);

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>
