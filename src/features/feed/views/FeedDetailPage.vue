<template>
  <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white w-[90%] max-w-5xl h-[70%] rounded-xl flex overflow-hidden relative">
      <!-- 좌측: 이미지 -->
      <div class="w-2/3 bg-black relative flex items-center justify-center">
        <FeedCarousel v-if="feed" :images="feed.imageUrls" />

        <!-- 오버레이 버튼 -->
        <div
          class="absolute right-4 bottom-4 flex flex-col items-center gap-4 text-white text-sm p-2"
        >
          <button class="flex flex-col items-center opacity-80 hover:opacity-100">
            <i
              :class="[
                liked ? 'fa-solid' : 'fa-regular',
                'fa-heart cursor-pointer transition-transform duration-200',
                animateLike ? 'scale-150' : '',
              ]"
              @click="toggleLike"
            />
            <span>{{ likeCount }}</span>
          </button>
          <button class="flex flex-col items-center opacity-80 hover:opacity-100">
            <i class="fa-regular fa-comment"></i>
            <span>{{ feed?.commentCount }}</span>
          </button>
          <button class="flex flex-col items-center opacity-80 hover:opacity-100">
            <i class="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>

      <!-- 우측: 댓글/작성자 -->
      <div class="w-1/3 flex flex-col p-4 gap-4">
        <FeedHeader
          v-if="feed"
          :author="feed.author"
          :createdAt="feed.createdAt"
          :mine="feed.mine"
        />
        <span class="content">{{ feed?.content }}</span>
        <CommentSection v-if="feed" :target-id="feed.id" target-type="FEED" />
      </div>

      <!-- 닫기 버튼 -->
      <button @click="close" class="absolute top-2 right-3 text-xl text-gray-500">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchFeed } from '@/api/feed.js';

import FeedCarousel from '../components/FeedCarousel.vue';
import FeedHeader from '../components/FeedHeader.vue';
import CommentSection from '@/components/CommentSection.vue';
import { startLoading } from '@/composable/useLoadingBar.js';
import { likeFeed, unLikeFeed } from '@/api/like.js';

const feed = ref(null);
const route = useRoute();
const router = useRouter();
const liked = ref(false);
const likeCount = ref(0);

watch(feed, (newFeed) => {
  if (newFeed) {
    liked.value = newFeed.liked;
    likeCount.value = newFeed.likeCount;
  }
});

const close = () => {
  router.back();
};

const animateLike = ref(false);
const toggleLike = async () => {
  const payload = {
    targetId: route.params.id, // ← 부모 컴포넌트에서 넘겨줘야 함
    targetType: 'FEED',
  };

  try {
    if (liked.value) {
      await unLikeFeed(payload);
      likeCount.value -= 1;
    } else {
      await likeFeed(payload);
      likeCount.value += 1;
    }
    liked.value = !liked.value;

    animateLike.value = true;
    setTimeout(() => {
      animateLike.value = false;
    }, 200);
  } catch (e) {
    console.error('좋아요 처리 실패:', e);
  }
};
onMounted(async () => {
  const feedId = route.params.id;
  startLoading();
  try {
    const res = await fetchFeed(feedId);
    if (res.data.success) {
      feed.value = res.data.data;
    }
  } catch (e) {
    console.error('피드 조회 실패', e);
  }
});
</script>

<style scoped>
.content {
  @apply text-sm text-gray-800 px-4 mb-4;
}
</style>
