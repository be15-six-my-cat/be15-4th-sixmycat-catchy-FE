import './assets/main.css';
import 'pretendard/dist/web/static/pretendard.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.js';
import { loginUserTest } from '@/api/member.js';

import App from './App.vue';
import router from './router/index.js';

async function bootstrap() {
  const app = createApp(App);
  app.use(createPinia());

  const authStore = useAuthStore();

  try {
    const resp = await loginUserTest();
    authStore.setAuth(resp.data.data.accessToken);
    console.log('초기화 : 로그인 상태 유지');
  } catch (e) {
    console.log('초기화 : 로그아웃 상태 유지');
  }

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
