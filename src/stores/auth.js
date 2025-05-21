import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/* 강사님 코드로 초기 구조 세팅 */
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null);
  const expirationTime = ref(null);
  const memberId = ref(null);

  // 인증 되어 있는지 확인하는 getter 값
  const isAuthenticated = computed(
    () => !!accessToken.value && Date.now() < (expirationTime.value || 0),
  );

  function setAuth(at) {
    accessToken.value = at;
    try {
      const payload = JSON.parse(atob(at.split('.')[1]));
      expirationTime.value = payload.exp * 1000;
      memberId.value = payload.sub;
    } catch (e) {
      accessToken.value = null;
      expirationTime.value = null;
    }
  }

  function clearAuth() {
    accessToken.value = null;
    expirationTime.value = null;
  }

  return {
    accessToken,
    expirationTime,
    isAuthenticated,
    setAuth,
    clearAuth,
    memberId,
  };
});
