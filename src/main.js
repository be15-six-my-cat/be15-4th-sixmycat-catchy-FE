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
          console.log('📦 fetchMyProfile 응답:', res.data); // ✅ 로그 추가
          const profileData = res.data.data ?? {};
          const { profileImage, nickname } = profileData;

          console.log('🖼️ profileImage:', profileImage);
          console.log('🏷️ nickname:', nickname);

          defaultProfileStore.setProfileImage(profileImage); // null이면 랜덤 이미지 설정됨
          defaultProfileStore.setNickname(nickname);
          console.log('✅ 프로필 이미지 초기 설정 완료');
        } catch (e) {
          console.warn('❌ 프로필 이미지 설정 실패:', e);
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
