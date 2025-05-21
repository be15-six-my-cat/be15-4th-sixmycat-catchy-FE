<script setup>
import { watch } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useDefaultProfileStore } from '@/stores/defaultProfileStore.js';

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

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const defaultProfileStore = useDefaultProfileStore();
// ✅ image를 profileImage로 별칭 지정
const { image: profileImage, nickname } = storeToRefs(defaultProfileStore);

// ✅ 상태 변화 로그
watch(
  [isAuthenticated, profileImage],
  ([auth, img]) => {
    console.log('👤 isAuthenticated:', auth);
    console.log('🖼️ profileImage:', img);
  },
  { immediate: true }
);
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

    <!-- 기존 하단 고정 UI (수정 전 코드) -->
    <!--
    <footer class="threads">
      <img
        src="https://cdn.pixabay.com/photo/2017/11/03/04/01/pets-2913316_1280.jpg"
        alt="프로필"
      />
      <span>프로필</span>
    </footer>
    -->

    <!-- 👇 수정된 로그인 상태 반영 코드 시작 -->
    <footer class="threads" v-if="isAuthenticated">
      <img
        :src="profileImage"
        alt="프로필"
      />
      <RouterLink to="/profile">{{ nickname }}</RouterLink>
      <span class="logout" @click="authStore.clearAuth">로그아웃</span>
    </footer>

    <footer class="threads" v-else>
      <RouterLink to="/member/start">Catchy 시작하기</RouterLink>
    </footer>
    <!-- ☝ 수정된 로그인 상태 반영 코드 끝 -->
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
  @apply font-bold text-sm text-gray-700 flex items-center justify-center gap-2 pb-4;
}
.threads img {
  @apply w-6 h-6 rounded-full;
}
.logout {
  @apply text-red-500 cursor-pointer;
}
</style>
