<template>
  <div class="feed-action">
    <div class="flex items-center gap-4">
      <div class="action-wrapper">
        <i v-if="liked" class="fa-solid fa-heart cursor-pointer" @click="toggleLike"></i>
        <i v-else class="fa-regular fa-heart cursor-pointer" @click="toggleLike"></i>
        <span class="inline-block text-center w-3">{{ likeCount }}</span>
      </div>
      <div class="action-wrapper">
        <i class="fa-regular fa-comment"></i>
        <span class="inline-block text-center w-3">{{ commentCount }}</span>
      </div>
    </div>
    <div>
      <i class="fa-solid fa-share-nodes"></i>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  likeCount: Number,
  commentCount: Number,
  liked: Boolean,
});

const liked = ref(props.liked);
const likeCount = ref(props.likeCount);
const toggleLike = () => {
  if (liked.value) {
    likeCount.value -= 1;
  } else {
    likeCount.value += 1;
  }
  liked.value = !liked.value;

  //API 호출
};
</script>

<style scoped>
.feed-action {
  @apply flex justify-between gap-4 p-4 text-primary text-body-sm;
}
.action-wrapper {
  @apply flex items-center gap-2;
}
</style>
