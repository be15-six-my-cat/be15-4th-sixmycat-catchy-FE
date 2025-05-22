import SignupView from '@/features/member/views/SignupView.vue';
import SignupExtraView from '@/features/member/views/SignupExtraView.vue';
import ProfileView from '@/features/member/views/ProfileView.vue';
import ProfileEditView from '@/features/member/views/ProfileEditView.vue';
import MemberInfoView from '@/features/member/views/MemberInfoView.vue';
import BlockListView from '@/features/member/views/BlockListView.vue';

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
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
  },

  {
    path: '/profile/edit',
    name: 'ProfileEditView',
    component: ProfileEditView,
  },
  {
    path: '/member/info',
    name: 'MemberInfoView',
    component: MemberInfoView,
  },
  {
    path: '/profile/blocked',
    name: 'BlockListView',
    component: BlockListView,
  },
];
