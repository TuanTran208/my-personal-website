<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
       <div class="flex items-center gap-3">
         <div class="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
         </div>
         <div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Video Downloader</h3>
            <p class="text-xs text-gray-500">Save videos from YouTube, Facebook, etc.</p>
         </div>
       </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex-grow flex flex-col">
        <div class="space-y-4">
             <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
                <input 
                  type="text" 
                  v-model="url"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow" 
                  placeholder="Paste video link here..." 
                />
             </div>
             
             <div v-if="!downloadUrl">
                <button 
                    @click="download"
                    :disabled="isDownloading"
                    class="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <svg v-if="isDownloading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {{ isDownloading ? 'Fetching Video...' : 'Fetch Video' }}
                </button>
             </div>
             
             <div v-else class="flex gap-2">
                <a 
                   :href="downloadUrl"
                   download="video_download.mp4"
                   class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-center text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 no-underline"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Save Video
                </a>
                <button 
                   @click="reset"
                   class="px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                >
                   Reset
                </button>
             </div>
        </div>
        
        <!-- Supported Sites (Microcopy) -->
        <div class="mt-8 text-center">
            <p class="text-xs text-gray-400 mb-2">WORKS WITH</p>
            <div class="flex justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               <!-- Simple Logotypes (Text or SVG) -->
               <span class="font-bold text-gray-600 dark:text-gray-400">YouTube</span>
               <span class="font-bold text-gray-600 dark:text-gray-400">Facebook</span>
               <span class="font-bold text-gray-600 dark:text-gray-400">TikTok</span>
               <span class="font-bold text-gray-600 dark:text-gray-400">Instgram</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const url = ref('');
const isDownloading = ref(false);
const downloadUrl = ref(null);

const download = async () => {
    if (!url.value) return;
    isDownloading.value = true;
    downloadUrl.value = null;
    
    try {
        const key = localStorage.getItem('pandory_access_key');
        
        const response = await fetch('/api/utilities/download-video', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-access-key': key || ''
            },
            body: JSON.stringify({ url: url.value })
        });

        if (response.status === 401) throw new Error('Unauthorized. Please set Access Key in Settings.');
        if (!response.ok) throw new Error('Download failed');

        const result = await response.json();
        if (result.downloadUrl) {
            downloadUrl.value = result.downloadUrl;
            alert('Video Ready! Click Download button to save.');
        } else {
            throw new Error('No download URL returned');
        }

    } catch (error) {
        alert('Error downloading video: ' + error.message);
    } finally {
        isDownloading.value = false;
    }
};



const reset = () => {
    url.value = '';
    downloadUrl.value = null;
};

</script>
