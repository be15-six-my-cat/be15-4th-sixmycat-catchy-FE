<script setup>
import { RouterLink } from 'vue-router';

const emit = defineEmits(['open-upload-modal']);

function handleCreateClick() {
  emit('open-upload-modal');
}

const navItems = [
  { label: '피드', icon: 'fas fa-home', path: '/feed' },
  { label: '쮸르', icon: 'fa-solid fa-circle-play', path: '/jjure' },
  { label: '게임', icon: 'fas fa-gamepad', path: '/game' },
  { label: '알림', icon: 'fas fa-bell', path: '/notifications' },
  { label: '만들기', icon: 'fa-solid fa-square-plus', type: 'modal' },
];
</script>

<template>
  <nav class="nav">
    <ul class="nav-list">
      <li v-for="(item, index) in navItems" :key="index">
        <RouterLink v-if="!item.type" :to="item.path" class="nav-item">
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </RouterLink>

        <button
          v-else-if="item.type === 'modal'"
          type="button"
          class="nav-item"
          @click="handleCreateClick"
        >
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </li>
    </ul>

    <footer class="threads">
      <img
        src="https://cdn.pixabay.com/photo/2017/11/03/04/01/pets-2913316_1280.jpg"
        alt="프로필"
      />
      <span>프로필</span>
    </footer>
  </nav>
</template>

<style scoped>
.nav {
  @apply flex flex-col justify-between items-center w-full h-full;
}

.nav-list {
  @apply w-full;
}

.nav-item {
  @apply flex items-center w-full text-body-md text-gray-700 py-2 px-1 transition-colors;
}
.nav-item i {
  @apply w-5 mr-2 text-primary;
}
.nav-item:hover {
  @apply text-primary;
}

.threads {
  @apply font-bold text-sm text-gray-700 flex items-center justify-center gap-2;
}
.threads img {
  @apply w-6 h-6 rounded-full;
}
</style>
