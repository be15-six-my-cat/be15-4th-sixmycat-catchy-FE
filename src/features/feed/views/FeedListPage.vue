<template>
  <div
    ref="scrollContainer"
    class="flex flex-col gap-6 items-center p-6 max-h-[100vh] overflow-y-auto"
  >
    <router-view />
    <FeedCard v-for="feed in feeds" :key="feed.id" :feed="feed" />
    <p v-if="isLoading" class="loading">불러오는 중...</p>
    <p v-if="!isLoading && feeds.length === 0" class="empty">피드가 없습니다.</p>
    <div v-if="isLastPage" class="text-gray-400 text-sm text-center py-2">catchy</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import FeedCard from '../components/FeedCard.vue';
import { fetchFeedList } from '@/api/feed.js';
import { useFeedRefreshStore } from '@/stores/feedRefreshStore.js';
import { useInfiniteScroll } from '@/composable/useInfiniteScroll.js';
import { startLoading, isLoading } from '@/composable/useLoadingBar.js';

const scrollContainer = ref(null);
const feedRefreshStore = useFeedRefreshStore();

const fetchFn = async (page) => {
  try {
    startLoading();
    const { data } = await fetchFeedList(page);
    return data;
  } catch (e) {
    console.log(e + '피드 목록 초기 로드 실패');
  }
};

const {
  items: feeds,
  loadMore,
  reset,
  isLastPage,
} = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: scrollContainer,
});

watch(
  () => feedRefreshStore.needsRefresh,
  async (shouldRefresh) => {
    if (shouldRefresh) {
      feedRefreshStore.clearRefresh();
      reset();
      await loadMore();
    }
  },
);

onMounted(async () => {
  startLoading();
});
</script>

<style scoped>
.loading {
  @apply mt-6 text-gray-500 text-sm;
}

.empty {
  @apply mt-10 text-gray-500 text-sm;
}
</style>
