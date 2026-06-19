import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import StockDashboard from '../views/StockDashboard.vue';
import UtilitiesDashboard from '../views/UtilitiesDashboard.vue';
import FoodieHubDashboard from '../views/FoodieHubDashboard.vue';
import OAuthCallback from '../views/OAuthCallback.vue';
import { useAuth } from '../composables/useAuth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/auth/discord/callback',
            name: 'oauth-callback',
            component: OAuthCallback
        },
        {
            path: '/stock-dashboard',
            name: 'stock-dashboard',
            component: StockDashboard,
            meta: { requiresOwner: true }
        },
        {
            path: '/utilities-dashboard',
            name: 'utilities-dashboard',
            component: UtilitiesDashboard
        },
        {
            path: '/foodie-hub',
            name: 'foodie-hub',
            component: FoodieHubDashboard
        }
    ]
});

router.beforeEach((to, from, next) => {
    const { isOwner } = useAuth();
    
    if (to.meta.requiresOwner && !isOwner.value) {
        next({ name: 'home' });
    } else {
        next();
    }
});

export default router;
