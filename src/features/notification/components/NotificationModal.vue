<script setup>
import NotificationList from '@/features/notification/components/NotificationList.vue';
import { onMounted, ref } from 'vue';
import { getNotifications } from '@/api/notification.js';
import { startLoading } from '@/composable/useLoadingBar.js';

const emit = defineEmits(['close']);

const notifications = ref([]);
const curPage = ref(1);

const fetchNotifications = async (page = 1) => {
  try {
    startLoading();
    console.log(page + ' 페이지 초기 로드');
    const { data: wrapper } = await getNotifications(page);
    notifications.value = wrapper.data.content;
    curPage.value = wrapper.data.currentPage + 1;
  } catch (e) {
    console.log(e + '알림 목록 초기 로드 실패');
  }
};

const loadAdditionalNotifications = async (page = 1) => {
  try {
    startLoading();
    console.log(page + ' 페이지 추가 로드');
    const { data: wrapper } = await getNotifications(page);
    notifications.value.push(...wrapper.data.content);
    curPage.value = wrapper.data.currentPage + 1;
  } catch (e) {
    console.log('알림 목록 추가 로드 실패');
  }
};

onMounted(() => fetchNotifications());
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <section class="noti-modal">
      <div class="modal-header">
        <button class="cancel-button" @click="emit('close')">x</button>
      </div>
      <div class="modal-body">
        <div class="header1">알림</div>
        <div class="body-scroll">
          <NotificationList :notifications="notifications" />
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
