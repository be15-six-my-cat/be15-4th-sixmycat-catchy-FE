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
  <div v-if="notifications.length !== 0" class="text-gray-500 text-start">이번 달</div>
  <div class="space-y-4 max-height overflow-y-auto">
    <NotificationItem
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<style scoped></style>
