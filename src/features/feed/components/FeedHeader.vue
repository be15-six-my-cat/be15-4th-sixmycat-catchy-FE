<template>
  <div class="feed-header">
    <div class="author">
      <img :src="author.profileImageUrl" alt="profile" class="profile-image" />
      <span class="nickname">{{ author.nickname }}</span>
    </div>
    <div class="flex gap-4 items-center">
      <span class="text-xs text-gray-400">{{ formattedTime }}</span>
      <EditDeleteDropdown v-if="mine" @edit="$emit('edit')" @delete="$emit('delete')" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EditDeleteDropdown from '@/components/EditDeleteDropdown.vue';

dayjs.extend(relativeTime);

const props = defineProps({
  author: Object,
  createdAt: String,
  mine: Boolean,
});
const formattedTime = computed(() => dayjs(props.createdAt).fromNow());
</script>

<style scoped>
.feed-header {
  @apply flex items-center justify-between px-4 py-3;
}

.author {
  @apply flex items-center gap-3;
}

.author .profile-image {
  @apply w-6 h-6 rounded-full object-cover;
}

.author .nickname {
  @apply text-xs font-semibold;
}
</style>
