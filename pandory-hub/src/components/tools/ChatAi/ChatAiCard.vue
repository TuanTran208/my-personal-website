<!--
=================================================================
File: src/components/tools/ChatAi/ChatAiCard.vue
=================================================================
-->
<template>
  <UiCard :tool="tool" :is-favorited="isFavorited" @toggle-favorite="$emit('toggleFavorite', tool.id)" />
</template>

<script setup>
import UiCard from '../../ui/UiCard.vue';
defineProps({
  tool: Object,
  isFavorited: Boolean
});
defineEmits(['toggleFavorite']);
</script>
