<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const { profileImage } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="profile-card">
    <img :src="profileImage" alt="프로필 이미지" class="rounded-full w-20 h-20"/>
  </div>
</template>
