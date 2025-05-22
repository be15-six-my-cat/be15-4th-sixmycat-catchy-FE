import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 이미지 자동 가져오기
const imageMap = import.meta.glob('@/assets/default_images/*.png', {
  eager: true,
  import: 'default',
});
const fallbackImages = Object.values(imageMap); // 경로 정리됨

function getRandomDefaultImage() {
  const index = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[index];
}

export const useDefaultProfileStore = defineStore('defaultProfile', () => {
  const image = ref(null);
  const nickname = ref('');

  function setProfileImage(url) {
    image.value = url ?? getRandomDefaultImage();
  }

  function setNickname(name) {
    nickname.value = name;
  }

  function clearProfileImage() {
    image.value = null;
  }

  const hasImage = computed(() => !!image.value);

  return {
    image,
    nickname,
    hasImage,
    setProfileImage,
    setNickname,
    clearProfileImage,
  };
});
