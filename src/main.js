import './assets/main.css';
import 'pretendard/dist/web/static/pretendard.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// import { loginUserTest } from '@/api/member.js'; // 👈 자동 로그인 제거로 인해 주석 처리

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

  // 👇 [자동 로그인 비활성화]
  // 앱 로딩 시 accessToken 자동 재발급 요청을 비활성화했습니다.
  // 로그인 흐름을 사용자 액션 기반으로 처리하기 위해 아래 코드를 주석 처리합니다.
  //
  // try {
  //   const resp = await loginUserTest();
  //   authStore.setAuth(resp.data.data.accessToken);
  //   console.log('초기화 : 로그인 상태 유지');
  // } catch (e) {
  //   console.log('초기화 : 로그아웃 상태 유지');
  // }

  // ✅ accessToken 복원 이후에 프로필 이미지 설정
  watch(
    () => authStore.accessToken,
    async (token) => {
      if (token && authStore.isAuthenticated) {
        try {
          const res = await fetchMyProfile();
          const { profileImage, nickname } = res.data.data;
          defaultProfileStore.setProfileImage(profileImage); // null이면 랜덤 이미지 설정됨
          defaultProfileStore.setNickname(nickname);
          console.log('✅ 프로필 이미지 초기 설정 완료');
        } catch (e) {
          console.warn('❌ 프로필 이미지 설정 실패:', e);
        }
      }
    },
    { immediate: true }
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
