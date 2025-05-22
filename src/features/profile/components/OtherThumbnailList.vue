<script setup>
import { ref, watch } from 'vue';

defineProps({
  selectedTab: String,
});

const items = ref([]);

const fetchItems = async () => {
  try {
    const res = await axios.get(`/api/items?tab=${props.selectedTab}`);
    items.value = res.data;
  } catch (error) {
    console.error('API 오류:', error);
  }
};

watch(
  () => props.selectedTab,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      fetchItems();
    }
  },
  { immediate: true }, // 초기 실행도 포함시킬 경우
);
</script>

<template>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>

<style scoped></style>
