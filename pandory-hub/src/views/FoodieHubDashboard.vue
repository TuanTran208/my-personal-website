<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
    <!-- Header -->
    <header class="max-w-7xl mx-auto mb-8">
      <div class="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
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
            <span class="text-blue-600 dark:text-blue-400">Pandory</span> FoodieHub
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">My personal food category organizer and restaurant recommender.</p>
        </div>

        <div class="flex items-center gap-3 self-end md:self-auto">
          <button 
            @click="openAddModal" 
            class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-4 shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Restaurant
          </button>
          <AuthWidget class="hidden md:flex" />
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto space-y-8">
      <!-- Search & Suggestion Section -->
      <section class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-850 dark:text-white mb-4 flex items-center gap-2">
          🍳 What are you craving?
        </h2>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-grow">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="e.g. chicken, pho, pizza, gourmet..." 
              @keyup.enter="getFoodSuggestions"
              class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 text-gray-800 dark:text-white rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg class="w-5 h-5 absolute left-3.5 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button 
            @click="getFoodSuggestions"
            class="cursor-pointer bg-blue-650 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-all text-sm"
          >
            Suggest Restaurant
          </button>
        </div>

        <!-- Suggestion Shortcuts -->
        <div class="flex flex-wrap items-center gap-2 mt-4">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Suggestions:</span>
          <button 
            @click="quickSuggest('chicken')"
            class="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1 transition-colors"
          >
            🔥 Chicken
          </button>
          <button 
            @click="quickSuggest('pho')"
            class="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1 transition-colors"
          >
            🍜 Pho
          </button>
          <button 
            @click="quickSuggest('pizza')"
            class="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1 transition-colors"
          >
            🍕 Pizza
          </button>
        </div>

        <!-- Suggestion Results Display -->
        <div v-if="suggestResults !== null" class="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-md font-bold text-gray-800 dark:text-white">🎯 Recommended Spots</h3>
            <button @click="clearSuggestions" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">Clear</button>
          </div>
          
          <div v-if="suggestResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="rest in suggestResults" 
              :key="'suggest-' + rest.id"
              class="border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <div class="flex justify-between items-start gap-2">
                  <h4 class="text-md font-bold text-gray-850 dark:text-white">{{ rest.name }}</h4>
                  <div class="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded font-bold text-xs">
                    ★ {{ rest.rating.toFixed(1) }}
                  </div>
                </div>
                <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">{{ getCategoryName(rest.categoryId) }}</p>
                <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">{{ rest.notes }}</p>
                <div class="flex flex-wrap gap-1 mt-3">
                  <span 
                    v-for="dish in rest.signatureDishes" 
                    :key="dish" 
                    class="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs font-semibold px-2 py-0.5 rounded"
                  >
                    {{ dish }}
                  </span>
                </div>
              </div>
              
              <div class="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 text-xs flex justify-between font-semibold text-gray-500 dark:text-gray-400">
                <span>📍 {{ rest.address }}</span>
                <span class="text-amber-600 dark:text-amber-400">~{{ formatPrice(rest.avgPrice) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 bg-gray-50/50 dark:bg-gray-900/20 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p class="font-semibold text-gray-500 dark:text-gray-400">No matching restaurants found for craving "{{ lastSearchQuery }}".</p>
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs -->
      <section>
        <div class="flex flex-wrap gap-2 pb-1">
          <button 
            @click="activeCategory = 'All'"
            :class="[
              'cursor-pointer rounded-lg font-bold px-4 py-2 text-sm transition-all',
              activeCategory === 'All' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-150 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            🍱 All Categories
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'cursor-pointer rounded-lg font-bold px-4 py-2 text-sm transition-all flex items-center gap-1.5',
              activeCategory === cat.id 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-150 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <span>{{ getCategoryEmoji(cat.name) }}</span>
            {{ cat.name }}
          </button>
        </div>
      </section>

      <!-- Restaurant Listings -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Add New Restaurant Dotted Card -->
        <div 
          @click="openAddModal"
          class="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-800/10 hover:bg-white dark:hover:bg-gray-850 p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-sm min-h-[250px] group"
        >
          <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-655 w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 class="text-md font-bold text-gray-800 dark:text-white">Add Restaurant</h3>
          <p class="text-xs text-gray-400 mt-1">Catalog a food spot you've recently dined at.</p>
        </div>

        <!-- Restaurant Cards -->
        <div 
          v-for="rest in filteredRestaurants" 
          :key="rest.id"
          class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex justify-between items-start gap-2 mb-2">
              <h3 class="text-md font-bold text-gray-800 dark:text-white leading-tight">{{ rest.name }}</h3>
              <div class="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded font-bold text-xs flex-shrink-0">
                ★ {{ rest.rating.toFixed(1) }}
              </div>
            </div>

            <span class="bg-blue-50 dark:bg-blue-900/25 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded mb-3 inline-block">
              {{ getCategoryEmoji(getCategoryName(rest.categoryId)) }} {{ getCategoryName(rest.categoryId) }}
            </span>

            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 min-h-[36px] line-clamp-2" :title="rest.notes">{{ rest.notes }}</p>

            <div class="space-y-1.5 mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-gray-400 dark:text-gray-500">Address:</span>
                <span class="truncate" :title="rest.address">{{ rest.address }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-gray-400 dark:text-gray-500">Price:</span>
                <span>{{ formatPrice(rest.avgPrice) }}</span>
              </div>
            </div>

            <!-- Signature Dishes -->
            <div v-if="rest.signatureDishes && rest.signatureDishes.length > 0" class="mb-4">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Signature Dishes:</div>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="dish in rest.signatureDishes" 
                  :key="dish" 
                  class="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-650 text-[11px] font-medium px-2 py-0.5 rounded"
                >
                  {{ dish }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="flex gap-2 border-t border-gray-100 dark:border-gray-700/80 pt-4 mt-auto">
            <button 
              @click="openEditModal(rest)"
              class="cursor-pointer flex-grow bg-white dark:bg-gray-750 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-650 text-gray-700 dark:text-gray-300 font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button 
              @click="confirmDelete(rest)"
              class="cursor-pointer bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 border border-red-200/60 dark:border-red-900/40 text-red-650 dark:text-red-400 font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal Form (Add/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl max-w-lg w-full p-6 animate-scale-up">
        <div class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
          <h3 class="text-lg font-bold text-gray-805 dark:text-white">
            {{ isEditing ? 'Edit Restaurant' : 'New Restaurant' }}
          </h3>
          <button @click="showModal = false" class="cursor-pointer text-gray-400 hover:text-red-500 font-bold text-xl">✖</button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Restaurant Name*</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Grid: Category & Price -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category*</label>
              <select 
                v-model="form.categoryId" 
                required
                class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Price (VND)*</label>
              <input 
                v-model.number="form.avgPrice" 
                type="number" 
                min="0" 
                required
                class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Rating -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rating: {{ form.rating.toFixed(1) }} Stars</label>
            <div class="flex items-center gap-2">
              <input 
                v-model.number="form.rating" 
                type="range" 
                min="1" 
                max="5" 
                step="0.1" 
                class="w-full h-2 bg-gray-100 dark:bg-gray-750 accent-blue-650 rounded-lg appearance-none cursor-pointer border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address*</label>
            <input 
              v-model="form.address" 
              type="text" 
              required
              class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Signature Dishes -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Signature Dishes (Comma Separated)</label>
            <input 
              v-model="dishesInput" 
              type="text" 
              placeholder="e.g. Fried Chicken, Honey Wings, Spicy Noodles"
              class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Personal Review/Notes</label>
            <textarea 
              v-model="form.notes" 
              rows="3"
              class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
              type="button" 
              @click="showModal = false"
              class="cursor-pointer bg-white hover:bg-gray-55 dark:bg-gray-750 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-650 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-5 shadow-sm transition-colors text-sm"
            >
              {{ isEditing ? 'Save Changes' : 'Add Spot' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AuthWidget from '../components/global/AuthWidget.vue';

const categories = ref([]);
const restaurants = ref([]);
const activeCategory = ref('All');

const searchQuery = ref('');
const lastSearchQuery = ref('');
const suggestResults = ref(null);

// Modal Controls
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const dishesInput = ref('');

const form = ref({
  name: '',
  categoryId: '',
  rating: 5,
  avgPrice: 50000,
  address: '',
  signatureDishes: [],
  notes: ''
});

// Fetch FoodieHub categories & restaurants
const fetchData = async () => {
  try {
    const response = await fetch('/api/foodie-hub');
    if (!response.ok) throw new Error('Failed to load FoodieHub data');
    const data = await response.json();
    categories.value = data.categories || [];
    restaurants.value = data.restaurants || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});

// Computed filtering
const filteredRestaurants = computed(() => {
  if (activeCategory.value === 'All') return restaurants.value;
  return restaurants.value.filter(r => r.categoryId === activeCategory.value);
});

// Format Price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Map ID to Category Name
const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id);
  return cat ? cat.name : 'Unknown';
};

// Map Category Name to Emoji
const getCategoryEmoji = (name) => {
  switch (name.toLowerCase()) {
    case 'chicken': return '🔥';
    case 'vietnamese': return '🍜';
    case 'fast food': return '🍔';
    case 'sushi': return '🍣';
    case 'italian': return '🍕';
    case 'coffee & drinks': return '☕';
    case 'snack & dessert': return '🍰';
    case 'vegan': return '🥗';
    case 'seafood & snail': return '🐚';
    default: return '🍴';
  }
};

// Search / Recommendation trigger
const getFoodSuggestions = async () => {
  if (!searchQuery.value.trim()) return;
  try {
    const response = await fetch(`/api/foodie-hub/suggest?q=${encodeURIComponent(searchQuery.value)}`);
    if (!response.ok) throw new Error('Failed to get suggestions');
    suggestResults.value = await response.json();
    lastSearchQuery.value = searchQuery.value;
  } catch (error) {
    console.error('Error getting suggestions:', error);
  }
};

const quickSuggest = (item) => {
  searchQuery.value = item;
  getFoodSuggestions();
};

const clearSuggestions = () => {
  suggestResults.value = null;
  searchQuery.value = '';
};

// Modal Operations
const resetForm = () => {
  form.value = {
    name: '',
    categoryId: '',
    rating: 5,
    avgPrice: 50000,
    address: '',
    signatureDishes: [],
    notes: ''
  };
  dishesInput.value = '';
  isEditing.value = false;
  editingId.value = null;
};

const openAddModal = () => {
  resetForm();
  showModal.value = true;
};

const openEditModal = (rest) => {
  isEditing.value = true;
  editingId.value = rest.id;
  form.value = { ...rest };
  dishesInput.value = rest.signatureDishes ? rest.signatureDishes.join(', ') : '';
  showModal.value = true;
};

const submitForm = async () => {
  // Parse signature dishes
  form.value.signatureDishes = dishesInput.value
    ? dishesInput.value.split(',').map(d => d.trim()).filter(Boolean)
    : [];

  try {
    let response;
    if (isEditing.value) {
      response = await fetch(`/api/foodie-hub/restaurants/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
    } else {
      response = await fetch('/api/foodie-hub/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
    }

    if (!response.ok) throw new Error('Save restaurant failed');
    await fetchData();
    showModal.value = false;
    
    // Clear suggestion if active to refresh suggestions context
    if (suggestResults.value !== null && lastSearchQuery.value) {
      getFoodSuggestions();
    }
  } catch (error) {
    alert('Error saving restaurant: ' + error.message);
  }
};

const confirmDelete = async (rest) => {
  const consent = confirm(`Are you sure you want to delete ${rest.name}? This action cannot be undone.`);
  if (!consent) return;

  try {
    const response = await fetch(`/api/foodie-hub/restaurants/${rest.id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Delete failed');
    await fetchData();
    
    // Refresh suggestions if active
    if (suggestResults.value !== null && lastSearchQuery.value) {
      getFoodSuggestions();
    }
  } catch (error) {
    alert('Error deleting restaurant: ' + error.message);
  }
};
</script>

<style scoped>
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-up {
  animation: scaleUp 0.15s ease-out forwards;
}
</style>
