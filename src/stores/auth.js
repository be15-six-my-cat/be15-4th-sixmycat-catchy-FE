import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { logout as logoutApi } from '@/api/member.js'; // 로그아웃 API 추가
import { useDefaultProfileStore } from './defaultProfileStore.js'; // 프로필 상태 초기화 위해 추가

/* 강사님 코드로 초기 구조 세팅 */
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null);
  const expirationTime = ref(null);
  const memberId = ref(null);
export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref(null);
    const expirationTime = ref(null);
    const profileImage = ref(null);

    // 인증 여부 계산
    const isAuthenticated = computed(
      () => !!accessToken.value && Date.now() < (expirationTime.value || 0),
    );

    // JWT 파싱 후 저장
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

    // 기본 프로필 이미지 목록 및 랜덤 선택
    const fallbackImages = [
      new URL('@/assets/default_images/01_cat.png', import.meta.url).href,
      new URL('@/assets/default_images/02_cat.png', import.meta.url).href,
      new URL('@/assets/default_images/03_cat.png', import.meta.url).href,
      new URL('@/assets/default_images/04_cat.png', import.meta.url).href,
      new URL('@/assets/default_images/05_cat.png', import.meta.url).href,
      new URL('@/assets/default_images/06_cat.png', import.meta.url).href,
      new URL('@/assets/default_images/07_cat.png', import.meta.url).href,
      new URL('@/assets/default_images/08_cat.png', import.meta.url).href,
    ];

    function getRandomDefaultImage() {
      const index = Math.floor(Math.random() * fallbackImages.length);
      return fallbackImages[index];
    }

    // 프로필 이미지 설정
    function setProfileImage(imageUrl) {
      profileImage.value = imageUrl ?? getRandomDefaultImage();
    }

    // 인증 상태 초기화
    function clearAuth() {
      accessToken.value = null;
      expirationTime.value = null;
      profileImage.value = null;
    }

    // 로그아웃: 서버 요청 + 상태 초기화
    async function logout() {
      try {
        await logoutApi(); // 서버 로그아웃 API 호출
      } catch (err) {
        console.error('로그아웃 실패:', err);
      } finally {
        clearAuth(); // auth 상태 초기화
        const defaultProfileStore = useDefaultProfileStore();
        defaultProfileStore.$reset(); // 별도 store도 초기화
      }
    }

    return {
      accessToken,
      expirationTime,
      isAuthenticated,
      setAuth,
      clearAuth,
      logout,
      profileImage,
      setProfileImage,
      memberId
    };
  },
  {
    persist: {
      storage: sessionStorage, // 또는 localStorage
      paths: ['accessToken', 'expirationTime', 'profileImage'],
    },
  },
);
