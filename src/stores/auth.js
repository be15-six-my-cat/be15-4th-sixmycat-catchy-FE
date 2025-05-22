import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { logout as logoutApi } from '@/api/member.js';
import { useDefaultProfileStore } from '@/stores/defaultProfileStore.js';
import { showErrorToast } from '@/utills/toast.js';
export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref(null);
    const expirationTime = ref(null);
    const memberId = ref(null);

    const isAuthenticated = computed(
      () => !!accessToken.value && Date.now() < (expirationTime.value || 0),
    );

    function setAuth(at) {
      accessToken.value = at;
      try {
        const payload = JSON.parse(atob(at.split('.')[1]));
        if (!payload.exp) throw new Error('만료 시간 없음');
        expirationTime.value = payload.exp * 1000;
      } catch (e) {
        accessToken.value = null;
        expirationTime.value = null;
      }
    }

    function clearAuth() {
      accessToken.value = null;
      expirationTime.value = null;
      memberId.value = null;
    }

    async function logout() {
      try {
        await logoutApi();
      } catch (err) {
        showErrorToast('로그아웃이 실패했습니다. 다시 시도해주세요.');
      } finally {
        clearAuth();
        useDefaultProfileStore().clearProfileImage();
      }
    }

    return {
      accessToken,
      expirationTime,
      memberId,
      isAuthenticated,
      setAuth,
      clearAuth,
      logout,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['accessToken', 'expirationTime', 'memberId'],
    },
  },
);

// 기존 코드

// import { defineStore } from 'pinia';
// import { computed, ref } from 'vue';
//
// /* 강사님 코드로 초기 구조 세팅 */
// export const useAuthStore = defineStore('auth', () => {
//   const accessToken = ref(null);
//   const expirationTime = ref(null);
//   const memberId = ref(null);
//
//   // 인증 되어 있는지 확인하는 getter 값
//   const isAuthenticated = computed(
//     () => !!accessToken.value && Date.now() < (expirationTime.value || 0),
//   );
//
//   function setAuth(at) {
//     accessToken.value = at;
//     try {
//       const payload = JSON.parse(atob(at.split('.')[1]));
//       expirationTime.value = payload.exp * 1000;
//       memberId.value = payload.sub;
//     } catch (e) {
//       accessToken.value = null;
//       expirationTime.value = null;
//     }
//   }
//
//   function clearAuth() {
//     accessToken.value = null;
//     expirationTime.value = null;
//   }
//
//   return {
//     accessToken,
//     expirationTime,
//     isAuthenticated,
//     setAuth,
//     clearAuth,
//     memberId,
//   };
// });
