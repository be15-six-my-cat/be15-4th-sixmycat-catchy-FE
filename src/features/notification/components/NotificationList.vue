<script setup>
import NotificationItem from '@/features/notification/components/NotificationItem.vue';

const { notifications } = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="space-y-2 max-height overflow-y-auto">
    <div class="text-gray-500 text-start">이번 달</div>
    <NotificationItem
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<style scoped></style>
