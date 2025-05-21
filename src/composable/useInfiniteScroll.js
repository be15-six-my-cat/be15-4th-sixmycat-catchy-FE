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
      console.log('래퍼');
      console.log(wrapper);
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

  const handleScroll = () => {
    const el = scrollTargetRef.value;
    if (!el || isLoading.value || isLastPage.value) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMore();
    }
  };

  onMounted(() => {
    fetchInitial();
    scrollTargetRef.value?.addEventListener('scroll', handleScroll);
  });

  onBeforeUnmount(() => {
    scrollTargetRef.value?.removeEventListener('scroll', handleScroll);
  });

  return {
    items,
    isLoading,
    isLastPage,
  };
}
