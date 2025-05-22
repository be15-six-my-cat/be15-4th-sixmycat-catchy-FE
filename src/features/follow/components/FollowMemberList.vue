<script setup>
import NotificationItem from '@/features/notification/components/NotificationItem.vue';
import FollowMemberItem from '@/features/follow/components/FollowMemberItem.vue';

const { members } = defineProps({
  members: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="space-y-2 max-height border-b border-gray-200 overflow-y-auto">
    <FollowMemberItem v-for="(member, index) in members" :key="index" :member="member" />
  </div>
</template>

<style scoped></style>
