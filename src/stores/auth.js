import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/* 강사님 코드로 초기 구조 세팅 */
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null);
  const expirationTime = ref(null);

  // 👇 [추가] 프로필 이미지 상태 추가
  const profileImage = ref(null);

  // 인증 되어 있는지 확인하는 getter 값
  const isAuthenticated = computed(
    () => !!accessToken.value && Date.now() < (expirationTime.value || 0),
  );

  function setAuth(at) {
    console.log('🛠 setAuth 실행됨:', at);
    accessToken.value = at;
    try {
      const payload = JSON.parse(atob(at.split('.')[1]));
      console.log('🧑‍💻 로그인된 사용자 ID:', payload.sub); // 또는 payload.id
      if (!payload.exp) throw new Error('만료 시간 없음');
      expirationTime.value = payload.exp * 1000;
    } catch (e) {
      accessToken.value = null;
      expirationTime.value = null;
    }
  }

  // 👇 [추가] 기본 프로필 이미지 경로 목록 및 랜덤 선택 함수
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

  // 👇 [추가] 프로필 이미지 설정 메서드 (null이면 랜덤 기본 이미지 적용)
  function setProfileImage(imageUrl) {
    profileImage.value = imageUrl ?? getRandomDefaultImage();
  }

  function clearAuth() {
    accessToken.value = null;
    expirationTime.value = null;

    // 👇 [추가] 프로필 이미지도 초기화
    profileImage.value = null;
  }

  return {
    accessToken,
    expirationTime,
    isAuthenticated,
    setAuth,
    clearAuth,

    // 👇 [추가 항목들 리턴]
    profileImage,
    setProfileImage,
  };
});
