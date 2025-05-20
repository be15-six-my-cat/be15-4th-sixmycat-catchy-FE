<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { fetchJjureList } from '@/api/jjure.js';
import { usePagination } from '@/composable/usePagination.js';
import JjureCard from '@/features/jjure/components/JjureCard.vue';
import { startLoading } from '@/composable/useLoadingBar.js';

const { items: jjures, loadMore, reset, hasNext, isLoading } = usePagination(fetchJjureList);

const observer = ref(null);
const lastCard = ref(null);

const observe = () => {
  if (observer.value) observer.value.disconnect();
  observer.value = new IntersectionObserver(
    async ([entry]) => {
      if (entry.isIntersecting && hasNext.value && !isLoading.value) {
        await loadMore();
      }
    },
    { threshold: 1.0 },
  );

  if (lastCard.value) {
    observer.value.observe(lastCard.value);
  }
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
  <main class="jjure-list-page">
    <section class="jjure-list">
      <JjureCard
        v-for="(jjure, index) in jjures"
        :key="jjure.id"
        :id="jjure.id"
        :file-key="jjure.fileKey"
        :author-nickname="jjure.author.nickname"
        :author-image-url="jjure.author.profileImageUrl"
        :caption="jjure.caption"
        :music-title="jjure.musicUrl"
        :comment-preview="jjure.commentPreview?.content"
        :like-count="jjure.likeCount"
        :comment-count="jjure.commentCount"
        :ref="index === jjures.length - 1 ? lastCard : null"
      />
    </section>

    <p v-if="isLoading" class="loading">불러오는 중...</p>
    <p v-if="!isLoading && jjures.length === 0" class="empty">쭈르가 없습니다.</p>

    <router-view />
  </main>
</template>

<style scoped>
.jjure-list-page {
  @apply flex flex-col items-center px-4 py-10  min-h-screen;
}

.page-title {
  @apply text-xl font-bold text-gray-700 mb-6;
}

.jjure-list {
  @apply flex flex-col items-center gap-6 w-full;
}

.loading {
  @apply mt-6 text-gray-500 text-sm;
}

.empty {
  @apply mt-10 text-gray-500 text-sm;
}
</style>
