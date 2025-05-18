import JjureCreatePage from '@/features/jjure/views/JjureCreatePage.vue';

export const JjureRoutes = [
  {
    path: '/jjure',
    children: [
      {
        path: 'create',
        component: JjureCreatePage,
      },
    ],
  },
];
