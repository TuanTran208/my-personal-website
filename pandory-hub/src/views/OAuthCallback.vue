<template>
  <div class="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div v-if="!errorMsg" class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <div v-else class="text-red-500 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {{ errorMsg ? 'Authentication Failed' : 'Authenticating with Discord...' }}
      </h2>
      <p class="text-gray-500 mt-2 text-sm">{{ errorMsg || 'Please wait while we verify your credentials.' }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { login } = useAuth();
const errorMsg = ref('');

onMounted(async () => {
    const code = route.query.code;
    
    if (!code) {
        errorMsg.value = 'No authorization code provided.';
        setTimeout(() => router.push('/'), 3000);
        return;
    }

    try {
        const response = await fetch('/api/auth/discord/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            login(data.token, data.user);
            // Optional: redirect to intended route, or just home
            router.push('/');
        } else {
            errorMsg.value = data.error || 'Authentication failed.';
            setTimeout(() => router.push('/'), 3000);
        }
    } catch (e) {
        errorMsg.value = 'A network error occurred during authentication.';
        setTimeout(() => router.push('/'), 3000);
    }
});
</script>
