<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter p-6">
    <!-- Header / Navigation -->
    <header class="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
      <div class="w-full md:w-auto">
        <div class="flex justify-between items-center mb-2">
          <router-link to="/" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Hub
          </router-link>
          <AuthWidget class="md:hidden" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
           <span class="text-blue-600 dark:text-blue-400">Pandory</span> Utilities
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Essential tools for my daily operations.</p>
      </div>

      <div class="flex items-center gap-3 self-end md:self-auto">
         <AuthWidget class="hidden md:flex" />
      </div>
    </header>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Dashboard Security</h3>
            <p class="text-sm text-gray-500 mb-4">Enter Pandory Access Key to unlock utility functions.</p>
            
            <input 
                v-model="inputKey" 
                type="password" 
                placeholder="Enter Access Key" 
                class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 mb-4"
            />
            
            <div class="flex justify-end gap-2">
                <button @click="showSettings = false" class="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                <button @click="saveKey" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Save Key</button>
            </div>
        </div>
    </div>

    <!-- Main Grid Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
        
        <!-- Video Compressor (Large - 6 cols) -->
        <div class="xl:col-span-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <VideoCompressor />
        </div>

        <!-- Video Downloader (Large - 6 cols) -->
        <div class="xl:col-span-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <VideoDownloader />
        </div>

        <!-- Image Converter (Medium - 4 cols) -->
        <div class="xl:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <ImageConverter />
        </div>

         <!-- PDF to DOCX (Medium - 4 cols) -->
        <div class="xl:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <PdfToDocx />
        </div>
        
         <!-- Placeholder for Future Tool (Medium - 4 cols) -->
        <div class="xl:col-span-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 dark:text-gray-600">
             <svg class="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
             </svg>
             <span class="text-xs uppercase tracking-wider font-semibold">Add New Module</span>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VideoCompressor from '../components/tools/Utilities/VideoCompressor.vue';
import VideoDownloader from '../components/tools/Utilities/VideoDownloader.vue';
import ImageConverter from '../components/tools/Utilities/ImageConverter.vue';
import PdfToDocx from '../components/tools/Utilities/PdfToDocx.vue';
import AuthWidget from '../components/global/AuthWidget.vue';

const showSettings = ref(false);
const inputKey = ref('');
const hasKey = ref(false);

onMounted(() => {
    const key = localStorage.getItem('pandory_access_key');
    if (key) {
         hasKey.value = true;
         inputKey.value = key;
    } else {
        // Prompt on first visit if no key? Or just let them see the button
        showSettings.value = true;
    }
});

const saveKey = () => {
    if (inputKey.value) {
        localStorage.setItem('pandory_access_key', inputKey.value);
        hasKey.value = true;
        showSettings.value = false;
        // Reload to ensure children components pick it up? 
        // Better: components read from localStorage on action.
        window.location.reload(); 
    }
};
</script>
