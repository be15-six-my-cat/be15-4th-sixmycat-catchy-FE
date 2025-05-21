<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <section class="upload-modal">알림 모달</section>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black-alpha-60 flex justify-center items-center z-50;
}

.upload-modal {
  @apply w-[480px] min-h-[600px] bg-white rounded-lg px-10 py-10 text-center shadow-elevated flex flex-col justify-center items-center;
}
</style>
