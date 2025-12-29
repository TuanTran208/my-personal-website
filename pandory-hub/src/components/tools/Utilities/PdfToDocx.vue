<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-700">
       <div class="flex items-center gap-2">
         <div class="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
         </div>
         <div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Convert PDF</h3>
            <p class="text-xs text-gray-500">Extract text to Markdown or DOCX.</p>
         </div>
       </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-grow flex flex-col justify-center">
       <div class="p-6">
       <!-- Format Selection -->
       <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Format</label>
          <div class="flex space-x-4">
             <button 
                @click="format = 'markdown'"
                :class="[
                   'px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                   format === 'markdown' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
             >
                Markdown (.md)
             </button>
             <button 
                @click="format = 'docx'"
                :class="[
                   'px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                   format === 'docx' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
             >
                Word (.docx)
             </button>
          </div>
       </div>

       <div 
          class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
          @click="triggerUpload"
          @drop.prevent="handleDrop"
          @dragover.prevent
       >
            <span v-if="!file" class="text-xs text-gray-400">Click or drag PDF here</span>
            <span v-else class="text-xs font-semibold text-orange-600 truncate block">{{ file.name }}</span>
       </div>
       <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileSelect" />
    </div>
        
        <button 
            @click="convertPdf"
            :disabled="!file || isConverting"
            class="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            <svg v-if="isConverting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isConverting ? 'Converting...' : 'Start Conversion' }}
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const isConverting = ref(false);
const format = ref<'markdown' | 'docx'>('markdown');
const accessKey = ref('');
const error = ref('');

const triggerUpload = () => fileInput.value?.click();

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) file.value = target.files[0];
};

const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files) file.value = event.dataTransfer.files[0];
};

onMounted(() => {
    accessKey.value = localStorage.getItem('pandory_access_key') || '';
});

const convertPdf = async () => {
    if (!file.value) return;
    if (!accessKey.value) {
        error.value = 'Please enter Access Key in Dashboard Settings';
        return;
    }
    
    isConverting.value = true;
    error.value = '';

    const formData = new FormData();
    formData.append('file', file.value);
    formData.append('format', format.value);

    try {
        const response = await fetch('/api/utilities/pdf-to-docx', {
            method: 'POST',
            body: formData,
            headers: {
                'x-access-key': accessKey.value
            }
        });
        
        if (response.status === 401) throw new Error('Unauthorized. Please set Access Key in Settings.');
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const ext = format.value === 'docx' ? 'docx' : 'md';
            a.download = `converted_${file.value.name.replace('.pdf', '')}.${ext}`;
            
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            file.value = null;
        } else {
            throw new Error('Conversion failed');
        }

    } catch (err: any) {
        error.value = err.message;
    } finally {
        isConverting.value = false;
    }
};
</script>
