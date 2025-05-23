<script setup>
import { computed } from 'vue';
import { useDefaultProfileStore } from '@/stores/defaultProfileStore';

// 기본 이미지 import (Vite에서 URL로 변환됨)
import defaultImg from '@/assets/default_images/01_cat.png';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 40,
  },
});

const defaultProfileStore = useDefaultProfileStore();

const imageSrc = computed(() =>
  props.src?.trim() ? props.src : defaultProfileStore.defaultImage || defaultImg,
);
</script>

<template>
  <img
    :src="imageSrc"
    alt="프로필 이미지"
    class="rounded-full object-cover"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
