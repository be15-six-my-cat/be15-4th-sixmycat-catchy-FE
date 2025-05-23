<template>
  <div class="relative">
    <!-- 이클립스 버튼 -->
    <button @click="toggle" class="text-xs text-white">
      <i class="fa-solid fa-ellipsis"></i>
    </button>

    <!-- 드롭다운 메뉴 -->
    <div v-if="open" class="dropdown-menu">
      <button class="block w-full text-left px-4 py-3 hover:bg-gray-100" @click="handleEdit">
        수정
      </button>
      <button
        class="block w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100"
        @click="handleDelete"
      >
        삭제
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['edit', 'delete']);
const open = ref(false);

const toggle = () => {
  open.value = !open.value;
};

const handleEdit = () => {
  emit('edit');
  open.value = false;
};

const handleDelete = () => {
  emit('delete');
  open.value = false;
};

// 외부 클릭 시 닫기
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-menu {
  @apply absolute right-0 mt-2 w-24 bg-white border rounded shadow z-10 text-xs;
}
</style>
