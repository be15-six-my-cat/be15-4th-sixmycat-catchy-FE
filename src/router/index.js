import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import AppShell from '@/components/AppShell.vue';
import { JjureRoutes } from '@/features/jjure/router.js';
import gameRoutes from '@/features/game/router.js';
import { FeedRoutes } from '@/features/feed/router.js';
import { MemberRoutes } from '@/features/member/router.js'
import profileRoutes from '@/features/profile/router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppShell,
      children: [...JjureRoutes, ...gameRoutes, ...FeedRoutes, ...profileRoutes, ...MemberRoutes],
    },
  ],
});

// 전역 가드
router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  if ((to.name === 'login' || to.name === 'signup') && authStore.isAuthenticated) {
    return { name: 'main' };
  }
});

export default router;
