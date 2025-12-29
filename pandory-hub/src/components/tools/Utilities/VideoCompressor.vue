<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
       <div class="flex items-center gap-3">
         <div class="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
         </div>
         <div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Compress Video</h3>
            <p class="text-xs text-gray-500">Reduce file size without losing quality.</p>
         </div>
       </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex-grow flex flex-col justify-center">
        <!-- Step 1: Upload (Empty State) -->
        <div v-if="!file" 
             @click="triggerUpload"
             class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer group">
             
             <div class="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
             </div>
             <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload video</p>
             <p class="text-xs text-gray-400 mt-1">MP4, MOV, or AVI up to 500MB</p>
             <input type="file" ref="fileInput" class="hidden" accept="video/*" @change="handleFileSelect" />
        </div>

        <!-- Step 2: Options (Progressive Disclosure) -->
        <div v-else class="space-y-6">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div class="flex items-center gap-3">
                    <div class="bg-gray-200 dark:bg-gray-600 p-2 rounded">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                    </div>
                    <div class="text-sm">
                        <div class="font-medium text-gray-800 dark:text-white truncate max-w-[200px]">{{ file.name }}</div>
                        <div class="text-xs text-gray-500">{{ (file.size / 1024 / 1024).toFixed(1) }} MB</div>
                    </div>
                </div>
                <button @click="file = null" class="text-red-500 hover:text-red-700 p-1">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Compression Level</label>
                <div class="grid grid-cols-3 gap-2">
                    <button v-for="opt in ['High', 'Medium', 'Low']" :key="opt"
                        @click="quality = opt"
                        :class="['py-2 px-3 text-sm rounded-lg border text-center transition-colors', quality === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50']">
                        {{ opt }}
                    </button>
                </div>
                </div>


            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Format</label>
                <div class="grid grid-cols-3 gap-2">
                    <button v-for="fmt in ['mp4', 'mkv', 'mov']" :key="fmt"
                        @click="format = fmt"
                        :class="['py-2 px-3 text-sm rounded-lg border text-center transition-colors uppercase', format === fmt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50']">
                        {{ fmt }}
                    </button>
                </div>
            </div>

            <button 
                @click="compress"
                :disabled="isProcessing"
                class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <svg v-if="isProcessing" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isProcessing ? 'Compressing...' : 'Start Compression' }}
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const file = ref(null);
const fileInput = ref(null);
const quality = ref('Medium');
const format = ref('mp4'); // Default
const isProcessing = ref(false);

const triggerUpload = () => fileInput.value.click();

const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
        file.value = e.target.files[0];
    }
};

const compress = async () => {
    if (!file.value) return;
    isProcessing.value = true;
    
    const formData = new FormData();
    formData.append('file', file.value);
    formData.append('quality', quality.value);
    formData.append('format', format.value);
    
    const key = localStorage.getItem('pandory_access_key');

    try {
        const response = await fetch('http://localhost:3001/api/utilities/compress-video', {
            method: 'POST',
            headers: {
                'x-access-key': key || ''
            },
            body: formData
        });

        if (response.status === 401) throw new Error('Unauthorized. Please set Access Key in Settings.');
        if (!response.ok) throw new Error('Compression failed');

        // Trigger Download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Fix extension handling
        const originalName = file.value.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        a.download = `compressed_${nameWithoutExt}.${format.value}`;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Reset
        file.value = null;

    } catch (error) {
        alert('Error compressing video: ' + error.message);
    } finally {
        isProcessing.value = false;
    }
};
</script>
