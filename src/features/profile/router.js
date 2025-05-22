export default [
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/ProfileView.vue'),
    meta: { requiresAuth: true }, // 로그인된 사용자만 접근 가능
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import('./views/ProfileEditView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id',
    name: 'UserProfile',
    component: () => import('./views/ProfileView.vue'),
    props: true,
  },
]
