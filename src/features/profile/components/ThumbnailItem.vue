<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const { item, selectedTab } = defineProps({
  item: {
    type: Object,
    required: true,
  },
  selectedTab: {
    type: String,
    required: true,
  },
});

function handleItemClick() {
  if (selectedTab === 'OtherFeed') {
    router.push(`/feed/${item.feedId}`);
  } else if (selectedTab === 'OtherJjure') {
    router.push(`/jjure/${item.jjureId}`);
  } else if (selectedTab === 'MyFeed') {
    router.push(`/feed/${item.feedId}`);
  } else if (selectedTab === 'LikedFeed') {
    router.push(`/feed/${item.feedId}`);
  } else if (selectedTab === 'MyJjure') {
    router.push(`/jjure/${item.jjureId}`);
  } else if (selectedTab === 'LikedJjure') {
    router.push(`/jjure/${item.jjureId}`);
  }
}
</script>

<template>
  <div
    @click="handleItemClick"
    class="w-full aspect-square overflow-hidden m-1 cursor-pointer group"
  >
    <img
      :src="item.thumbnailUrl"
      alt="item.thumbnailUrl"
      class="object-cover w-full h-full transition-transform duration-300 group-hover:drop-shadow"
    />
  </div>
</template>

<style scoped></style>
