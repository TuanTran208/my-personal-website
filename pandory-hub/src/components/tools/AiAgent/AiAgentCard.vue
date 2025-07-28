<!--
=================================================================
File: src/components/tools/AiAgent/AiAgentCard.vue
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
