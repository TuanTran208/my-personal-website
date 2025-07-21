import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DownloadsView from '../views/DownloadsView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/downloads',
    name: 'Downloads',
    component: DownloadsView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;