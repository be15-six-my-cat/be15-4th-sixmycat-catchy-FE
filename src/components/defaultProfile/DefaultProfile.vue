<script setup>
defineProps({
  src: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 40, // 기본 사이즈
  },
});
</script>

<template>
  <img
    :src="src || '/assets/default_images/01_cat.png'"
    alt="프로필 이미지"
    class="rounded-full object-cover"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
