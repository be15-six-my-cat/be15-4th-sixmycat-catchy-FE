<template>
  <div class="relative inline-block">
    <i class="fa-solid fa-share-nodes cursor-pointer text-primary" @click.stop="toggleDropdown"></i>

    <div v-if="open" ref="dropdownRef" class="share-dropdown absolute top-full left-0 mt-2 z-50">
      <div class="share-section">
        <button @click="shareKakao" class="sns-btn kakao">k</button>
        <button @click="copyLink" class="sns-btn link">🔗</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { showErrorToast, showSuccessToast } from '@/utills/toast.js';

const props = defineProps({
  shareUrl: { type: String, default: () => window.location.href },
  shareText: { type: String, default: '' },
  shareImage: { type: String, default: '' },
});

const open = ref(false);
const dropdownStyle = ref({});
const dropdownRef = ref(null);

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false;
  }
};
const toggleDropdown = () => {
  open.value = !open.value;
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.shareUrl);
    showSuccessToast('링크가 복사되었습니다!');
    open.value = false;
  } catch (e) {
    showErrorToast('링크 복사 실패');
  }
};

const shareKakao = () => {
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: props.shareText || '피드를 확인해보세요!',
      description: 'CATCHY에서 작성된 피드입니다.',
      imageUrl: props.shareImage,
      link: {
        mobileWebUrl: props.shareUrl,
        webUrl: props.shareUrl,
      },
    },
    buttons: [
      {
        title: '피드 보기',
        link: {
          mobileWebUrl: props.shareUrl,
          webUrl: props.shareUrl,
        },
      },
    ],
  });

  open.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.share-section {
  @apply flex justify-center gap-3;
}

.share-dropdown {
  @apply w-40 p-3 bg-white border border-gray-200 rounded-xl shadow text-black;
  transform: translateX(-90%);
}

.sns-btn {
  @apply w-9 h-9 rounded-full text-white font-bold flex items-center justify-center cursor-pointer transition;
}

.kakao {
  @apply bg-yellow-300 hover:bg-yellow-400 text-black;
}

.link {
  @apply bg-gray-500 hover:bg-gray-600;
}
</style>
