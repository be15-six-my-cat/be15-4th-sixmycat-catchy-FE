import SignupView from '@/features/member/views/SignupView.vue';
import SignupExtraView from '@/features/member/views/SignupExtraView.vue';

export const MemberRoutes = [
  {
    path: '/member/start',
    name: 'SignupView',
    component: SignupView,
  },
  {
    path: '/member/start/extra',
    name: 'SignupExtraView',
    component: SignupExtraView,
  },
  {
    path: '/member/info',
    name: 'MemberInfoView',
    component: () => import('./views/MemberInfoView.vue'),
    meta: { requiresAuth: true },
  },
];
