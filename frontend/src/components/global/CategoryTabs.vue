<!--
=================================================================
File: src/components/global/CategoryTabs.vue
=================================================================
-->
<template>
  <nav class="flex flex-wrap gap-2">
    <button v-for="category in categories" :key="category"
      @click="$emit('update:activeCategory', category)"
      :class="['px-4 py-2 rounded-lg font-medium transition-colors duration-200', { 'active-tab': activeCategory === category, 'inactive-tab': activeCategory !== category }]">
      {{ category }}
    </button>
  </nav>
</template>

<script setup>
defineProps({
  categories: Array,
  activeCategory: String
});
defineEmits(['update:activeCategory']);
</script>
