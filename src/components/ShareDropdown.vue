<template>
  <div class="relative inline-block">
    <i class="fa-solid fa-share-nodes cursor-pointer" @click="toggleDropdown($event)"></i>

    <Teleport to="body">
      <div
        v-if="open"
        :style="dropdownStyle"
        ref="dropdownRef"
        class="absolute w-40 p-3 bg-white border border-gray-200 rounded-xl shadow text-black z-50"
      >
        <div class="share-section">
          <button @click="shareKakao" class="sns-btn kakao">k</button>
          <button @click="copyLink" class="sns-btn link">🔗</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { showErrorToast, showSuccessToast } from '@/utills/toast.js';

const props = defineProps({
  shareUrl: { type: String, default: () => window.location.href },
  shareText: { type: String, default: '' },
  shareImage: { type: String, default: '' },
});

const open = ref(false);
const dropdownStyle = ref({});

const toggleDropdown = async (event) => {
  open.value = !open.value;

  if (open.value) {
    await nextTick();
    const rect = event.target.getBoundingClientRect();
    dropdownStyle.value = {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY + 8}px`,
      left: `${rect.left + window.scrollX - 140}px`, // 위치 조절 필요시 here
    };
  }
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
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
  }

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
</script>

<style scoped>
.share-section {
  @apply flex justify-center gap-3;
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
