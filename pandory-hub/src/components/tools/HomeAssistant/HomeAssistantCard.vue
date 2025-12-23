<!--
=================================================================
File: src/components/tools/HomeAssistant/HomeAssistantCard.vue
=================================================================
-->
<template>
  <UiCard 
    :tool="tool" 
    :is-favorited="isFavorited" 
    @toggle-favorite="$emit('toggleFavorite', tool.id)"
    @click="openHomeAssistant"
  >
    <!-- Optional: Add specific status or mini-controls here later -->
    <div class="mt-4 flex items-center gap-2 text-sm text-blue-500 hover:underline">
        <span>Open Dashboard</span>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    </div>
  </UiCard>
</template>

<script setup>
import UiCard from '../../ui/UiCard.vue';

defineProps({
  tool: Object,
  isFavorited: Boolean
});

defineEmits(['toggleFavorite']);

const openHomeAssistant = () => {
    window.open('http://homeassistant.local:8123/', '_blank');
};
</script>
