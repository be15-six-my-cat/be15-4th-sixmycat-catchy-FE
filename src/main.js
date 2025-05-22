import './assets/main.css';
import 'pretendard/dist/web/static/pretendard.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router/index.js';

import { useAuthStore } from '@/stores/auth.js';
import { useDefaultProfileStore } from '@/stores/defaultProfileStore.js';
import { fetchMyProfile } from '@/api/member.js'; // 프로필 조회 API

async function bootstrap() {
  const app = createApp(App);

  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);

  const authStore = useAuthStore();
  const defaultProfileStore = useDefaultProfileStore();

  watch(
    () => authStore.accessToken,
    async (token) => {
      if (token && authStore.isAuthenticated) {
        try {
          const res = await fetchMyProfile();
          const profileData = res.data.data ?? {};
          const { profileImage, nickname } = profileData;

          defaultProfileStore.setProfileImage(profileImage); // null이면 랜덤 이미지 설정됨
          defaultProfileStore.setNickname(nickname);
        } catch (e) {
          console.warn('프로필 이미지 설정 실패:', e);
        }
      }
    },
    { immediate: true },
  );

  app.use(router);
  app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
  });

  app.mount('#app');
}

bootstrap();

// 기존 코드

// import './assets/main.css';
// import 'pretendard/dist/web/static/pretendard.css';
// import Toast from 'vue-toastification';
// import 'vue-toastification/dist/index.css';
//
// import { createApp } from 'vue';
// import { createPinia } from 'pinia';
// import { useAuthStore } from '@/stores/auth.js';
// import { loginUserTest } from '@/api/member.js';
//
// import App from './App.vue';
// import router from './router/index.js';
//
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
//
// async function bootstrap() {
//   const app = createApp(App);
//
//   const pinia = createPinia();
//   pinia.use(piniaPluginPersistedstate);
//   app.use(pinia);
//
//   const authStore = useAuthStore();
//
//   try {
//     const resp = await loginUserTest();
//     authStore.setAuth(resp.data.data.accessToken);
//     console.log('초기화 : 로그인 상태 유지');
//   } catch (e) {
//     console.log('초기화 : 로그아웃 상태 유지');
//   }
//
//   app.use(router);
//   app.use(Toast, {
//     position: 'top-right',
//     timeout: 3000,
//     closeOnClick: true,
//     pauseOnFocusLoss: true,
//     pauseOnHover: true,
//     draggable: true,
//     draggablePercent: 0.6,
//     showCloseButtonOnHover: false,
//     hideProgressBar: false,
//     closeButton: 'button',
//     icon: true,
//     rtl: false,
//   });
//   app.mount('#app');
// }
//
// bootstrap();
