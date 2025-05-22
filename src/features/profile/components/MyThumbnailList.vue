<script setup>
import { onMounted, ref, watch } from 'vue';
import { fetchLikedFeedList, fetchMyFeedList } from '@/api/feed.js';
import { fetchLikedJjureList, fetchMyJjureList } from '@/api/jjure.js';
import { useInfiniteScroll } from '@/composable/useInfiniteScroll.js';

const { selectedTab } = defineProps({
  selectedTab: String,
});

const scrollContainer = ref(null);

const fetchMap = {
  MyFeed: fetchMyFeedList,
  LikedFeed: fetchLikedFeedList,
  MyJjure: fetchMyJjureList,
  LikedJjure: fetchLikedJjureList,
};

const fetchFn = async (page = 1) => {
  try {
    const fetchFn = fetchMap[selectedTab];
    if (!fetchFn) {
      console.warn('해당하는 selectedTab이 없습니다.');
      items.value = [];
      return;
    }

    const res = await fetchFn({ page, size: 2 });
    items.value = res.data.data.content;
  } catch (error) {
    console.log('API 오류:', error);
    items.value = [];
  }
};

const { items: items, isLastPage } = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: scrollContainer,
});

watch(
  () => selectedTab,
  () => {
    fetchFn();
  },
  { immediate: true },
);

onMounted(fetchFn);
</script>

<template>
  <div class="flex flex-wrap justify-center w-full gap-4 p-12">
    <div v-if="items.value === 0">데이터가 없습니다.</div>
    <template v-else>
      <div class="body-scroll" ref="scrollContainer">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="w-full sm:w-[48%] md:w-[30%] aspect-square overflow-hidden"
        >
          <img
            :src="item.thumbnailUrl"
            alt="'item.thumbnailUrl'"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.body-scroll {
  @apply overflow-y-auto space-y-1 max-h-[70vh];
}
</style>
