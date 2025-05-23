<script setup>
import { ref, watch } from 'vue';
import { fetchOtherFeedList } from '@/api/feed.js';
import { fetchOtherJjureList } from '@/api/jjure.js';
import { useInfiniteScroll } from '@/composable/useInfiniteScroll.js';

const { selectedTab } = defineProps({
  selectedTab: String,
});

const scrollContainer = ref(null);
/* todo : 라우터 주소에서 member id 추출해서 추가하기 */

const fetchMap = {
  OtherFeed: fetchOtherFeedList,
  OtherJjure: fetchOtherJjureList,
};

const fetchFn = async (page = 1) => {
  try {
    const fetchFn = fetchMap[selectedTab];
    if (!fetchFn) {
      console.warn('해당하는 selectedTab이 없습니다.');
      items.value = [];
      return;
    }

    const { data } = await fetchFn({ page, size: 9 });
    return data;
  } catch (error) {
    console.log('API 오류:', error);
    items.value = [];
  }
};

const { items: items, reset } = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: scrollContainer,
});

watch(
  () => selectedTab,
  () => {
    reset();
  },
);
</script>

<template>
  <div class="justify-center w-[400px]">
    <div v-if="items.length === 0" class="text-gray-400 text-sm text-center py-2">
      데이터가 없습니다.
    </div>
    <template v-else>
      <div class="body-scroll" ref="scrollContainer">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="w-full sm:w-[48%] md:w-[30%] aspect-square overflow-hidden m-1"
        >
          <img :src="item.thumbnailUrl" alt="item.thumbnailUrl" class="object-cover" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.body-scroll {
  @apply overflow-y-auto space-y-1 max-h-[70vh] flex flex-wrap;
}
</style>
