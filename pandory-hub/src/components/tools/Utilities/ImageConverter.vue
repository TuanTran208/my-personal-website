<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-700">
       <div class="flex items-center gap-2">
         <div class="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
         </div>
         <h3 class="font-bold text-gray-800 dark:text-white text-sm">Image Converter</h3>
       </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-grow flex flex-col justify-between">
        <div v-if="!file" 
             @click="triggerUpload"
             class="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
             <span class="text-xs font-semibold">Drop or Click</span>
             <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />
        </div>

        <div v-else>
             <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-mono text-gray-600 dark:text-gray-300 truncate w-32">{{ file.name }}</span>
                <button @click="file = null" class="text-xs text-red-500 hover:underline">Remove</button>
             </div>
             
             <label class="block text-xs font-bold text-gray-500 mb-1">CONVERT TO</label>
             <select v-model="format" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm p-2 mb-4">
                 <option>PNG</option>
                 <option>JPG</option>
                 <option>WEBP</option>
             </select>

             <button 
                @click="convert"
                :disabled="isConverting"
                class="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2">
                <svg v-if="isConverting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isConverting ? 'Converting...' : 'Convert' }}
             </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const file = ref(null);
const fileInput = ref(null);
const format = ref('PNG');
const isConverting = ref(false);

const triggerUpload = () => fileInput.value.click();

const handleFileSelect = (e) => {
    if (e.target.files.length > 0) file.value = e.target.files[0];
};

const convert = async () => {
    if (!file.value) return;
    isConverting.value = true;

    const formData = new FormData();
    formData.append('file', file.value);
    formData.append('format', format.value.toLowerCase());
    
    const key = localStorage.getItem('pandory_access_key');

    try {
        const response = await fetch('http://localhost:3001/api/utilities/convert-image', {
            method: 'POST',
            headers: {
                'x-access-key': key || ''
            },
            body: formData
        });

        if (response.status === 401) throw new Error('Unauthorized. Please set Access Key in Settings.');
        if (!response.ok) throw new Error('Conversion failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const namePart = file.value.name.substring(0, file.value.name.lastIndexOf('.')) || file.value.name;
        a.download = `${namePart}.${format.value.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        file.value = null;
        alert('Conversion Successful!');

    } catch (error) {
        alert('Error converting image: ' + error.message);
    } finally {
        isConverting.value = false;
    }
};
</script>
