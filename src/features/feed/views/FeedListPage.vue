<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import FeedCard from '../components/FeedCard.vue';
import { isLoading, startLoading } from '@/composable/useLoadingBar.js';
import { fetchFeedList } from '@/api/feed.js';
import { useFeedRefreshStore } from '@/stores/feedRefreshStore.js';
import { useInfiniteScroll } from '@/composable/useInfiniteScroll.js';

const scrollContainer = ref(null);

const feedRefreshStore = useFeedRefreshStore();

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

onMounted(async () => {
  startLoading();
});
</script>

<template>
  <div>
    <router-view />
    <div ref="scrollContainer" class="flex flex-col gap-6 items-center p-6 max-h-[70vh]">
      <FeedCard v-for="feed in feeds" :key="feed.id" :feed="feed" />
      <div v-if="isLastPage" class="text-gray-400 text-sm text-center py-2">catchy</div>
    </div>
    <p v-if="isLoading" class="loading">불러오는 중...</p>
    <p v-if="!isLoading && feeds.length === 0" class="empty">피드가 없습니다.</p>
  </div>
</template>

<style scoped>
.loading {
  @apply mt-6 text-gray-500 text-sm;
}

.empty {
  @apply mt-10 text-gray-500 text-sm;
}
</style>
