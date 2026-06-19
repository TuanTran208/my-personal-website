<template>
  <div class="flex items-center gap-3 flex-shrink-0">
    <!-- Logged Out -->
    <button v-if="!isAuthenticated"
        @click="loginWithDiscord"
        class="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-[#5865F2] text-white hover:bg-[#4752c4] shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1"
    >
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        <span>Sign in with Discord</span>
    </button>

    <!-- Logged In -->
    <div v-else class="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="hidden sm:flex flex-col items-end px-3">
            <span class="text-sm font-bold text-gray-800 dark:text-white leading-tight mt-0.5">{{ user.username }}</span>
            <span v-if="isOwner" class="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Owner</span>
        </div>
        <button @click="logout" class="group relative cursor-pointer focus:outline-none hover:ring-2 hover:ring-red-400 rounded-full transition-all">
            <img :src="user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/favicon_bg_rm.png'" class="w-10 h-10 rounded-full object-cover bg-white" />
            <!-- Hover Tooltip -->
            <div class="absolute right-0 top-12 mt-1 w-28 bg-red-600 text-white text-xs font-semibold text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none py-1.5 shadow-lg shadow-red-500/20">
                Log Out
            </div>
        </button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth';

const { isAuthenticated, user, isOwner, logout } = useAuth();

const loginWithDiscord = async () => {
    try {
        const res = await fetch('/api/auth/discord/url');
        const data = await res.json();
        if (res.ok && data.url) {
            window.location.href = data.url;
        } else {
            console.error('Backend returned an error:', data.error);
            alert(`Unable to login: ${data.error || 'Server error'}. Please make sure the backend .env is fully configured with Discord OAuth credentials.`);
        }
    } catch (e) {
        console.error('Failed to get discord auth URL', e);
        alert('Cannot connect to backend server mapping for Discord OAuth.');
    }
};
</script>
