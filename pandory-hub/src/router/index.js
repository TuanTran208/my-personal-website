import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import StockDashboard from '../views/StockDashboard.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/stock-dashboard',
            name: 'stock-dashboard',
            component: StockDashboard
        }
    ]
});

export default router;
