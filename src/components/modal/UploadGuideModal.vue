<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'fileSelected']);
const inputRef = ref(null);

function openFileDialog() {
  inputRef.value?.click();
}

function handleFileChange(event) {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    emit('fileSelected', files);
    emit('close');
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <section class="upload-modal">
      <img
        src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
        alt="upload"
        class="w-[40px] h-[40px] object-cover mb-[20px]"
      />
      <h2 class="modal-title">사진과 동영상을 여기다 끌어다 놓으세요</h2>
      <p class="modal-description">또는 아래 버튼을 눌러 파일을 선택하세요.</p>

      <!-- 숨겨진 파일 선택 input -->
      <input
        ref="inputRef"
        type="file"
        accept="image/*,video/*"
        multiple
        class="hidden"
        @change="handleFileChange"
      />

      <button class="modal-button" @click="openFileDialog">컴퓨터에서 선택</button>
    </section>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black-alpha-60 flex justify-center items-center z-50;
}

.upload-modal {
  @apply w-[480px] min-h-[600px] bg-white rounded-lg px-10 py-10 text-center shadow-elevated flex flex-col justify-center items-center;
}

.modal-title {
  @apply text-body-lg font-semibold mb-5;
}

.modal-description {
  @apply text-body-sm text-gray-500 mb-5;
}

.modal-button {
  @apply bg-primary text-white text-body-sm px-4 py-2 rounded-md hover:bg-primary-hover;
}
</style>
