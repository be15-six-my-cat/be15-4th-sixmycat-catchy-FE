<script setup>
import NotificationList from '@/features/notification/components/NotificationList.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getNotifications } from '@/api/notification.js';
import { startLoading } from '@/composable/useLoadingBar.js';
import { useInfiniteScroll } from '@/composable/useInfiniteScroll.js';

const emit = defineEmits(['close']);

const scrollContainer = ref(null);

const fetchFn = async (page) => {
  try {
    startLoading();
    const { data } = await getNotifications(page);
    return data;
  } catch (e) {
    console.log(e + '알림 목록 초기 로드 실패');
  }
};

const { items: notifications, isLastPage } = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: scrollContainer,
});
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <section class="noti-modal">
      <div class="modal-header">
        <button class="cancel-button" @click="emit('close')">x</button>
      </div>
      <div class="modal-body">
        <div class="header1">알림</div>
        <div class="body-scroll" ref="scrollContainer">
          <NotificationList :notifications="notifications" />
          <div v-if="isLastPage" class="text-gray-400 text-sm text-center py-2">catchy</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black-alpha-20 flex justify-center items-center z-50;
}

.noti-modal {
  @apply w-[480px] max-h-[90vh] bg-white rounded-lg p-5 text-center shadow-elevated flex flex-col;
}

.modal-header {
  @apply w-full flex justify-end;
}

.cancel-button {
  @apply bg-primary text-white text-body-sm py-1 px-3 rounded-sm hover:bg-primary-hover;
}

.modal-body {
  @apply flex-1 flex flex-col;
}

.header1 {
  @apply text-body-lg font-bold p-3 border-b text-left mb-2;
}

.body-scroll {
  @apply overflow-y-auto space-y-1 max-h-[70vh];
}
</style>
