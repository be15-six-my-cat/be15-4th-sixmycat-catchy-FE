<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import FeedCard from '../components/FeedCard.vue';
import { startLoading } from '@/composable/useLoadingBar.js';
import { usePagination } from '@/composable/usePagination.js';
import { fetchFeedList } from '@/api/feed.js';

const { items: feeds, loadMore, reset, hasNext, isLoading } = usePagination(fetchFeedList);

const observer = ref(null);
const lastCard = ref(null);

const observe = () => {
  // if (observer.value) observer.value.disconnect();
  // observer.value = new IntersectionObserver(
  //   async ([entry]) => {
  //     if (entry.isIntersecting && hasNext.value && !isLoading.value) {
  //       await loadMore();
  //     }
  //   },
  //   { threshold: 1.0 },
  // );
  //
  // if (lastCard.value) {
  //   observer.value.observe(lastCard.value);
  // }
};

onMounted(async () => {
  startLoading();
  await loadMore();
  observe();
});

onBeforeUnmount(() => {
  if (observer.value) observer.value.disconnect();
});
</script>

<template>
  <div class="flex flex-col gap-6 items-center p-6">
    <FeedCard v-for="feed in feeds" :key="feed.id" :feed="feed" />
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
