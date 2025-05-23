// src/composables/useInfiniteScroll.js
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useInfiniteScroll({ fetchFn, scrollTargetRef, threshold = 100 }) {
  const items = ref([]);
  const curPage = ref(1);
  const totalPage = ref(1);
  const isLoading = ref(false);
  const isLastPage = ref(false);

  const fetchInitial = async () => {
    try {
      isLoading.value = true;
      const wrapper = await fetchFn(1);
      items.value = wrapper.data.content;
      curPage.value = wrapper.data.currentPage + 1;
      totalPage.value = wrapper.data.totalPages;
      if (wrapper.data.currentPage + 1 === wrapper.data.totalPages) {
        isLastPage.value = true;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (isLoading.value || isLastPage.value) return;

    try {
      isLoading.value = true;
      const wrapper = await fetchFn(curPage.value + 1);
      items.value.push(...wrapper.data.content);
      curPage.value = wrapper.data.currentPage + 1;
      if (wrapper.data.currentPage + 1 === wrapper.data.totalPages) {
        isLastPage.value = true;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const handleScroll = async () => {
    const el = scrollTargetRef.value;
    if (!el || isLoading.value || isLastPage.value) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      await loadMore();
    }
  };

  onMounted(async () => {
    await fetchInitial();
    scrollTargetRef.value?.addEventListener('scroll', handleScroll);
  });

  onBeforeUnmount(() => {
    scrollTargetRef.value?.removeEventListener('scroll', handleScroll);
  });

  const reset = async () => {
    curPage.value = 1;
    totalPage.value = 1;
    items.value = [];
    isLastPage.value = false;
    await fetchInitial(1);
  };

  return {
    items,
    isLoading,
    isLastPage,
    reset, // 외부에서 호출 가능하도록
    loadMore,
  };
}
