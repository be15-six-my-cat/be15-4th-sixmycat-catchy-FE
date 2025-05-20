<template>
  <div class="feed-action">
    <div class="flex items-center gap-4">
      <div class="action-wrapper">
        <i class="fa-regular fa-heart"></i>
        <span>{{ likeCount }}</span>
      </div>
      <div class="action-wrapper">
        <i class="fa-regular fa-comment"></i>
        <span>{{ commentCount }}</span>
      </div>
    </div>
    <div>
      <i class="fa-solid fa-share-nodes"></i>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  likeCount: Number,
  commentCount: Number,
  liked: Boolean,
});
</script>

<style scoped>
.feed-action {
  @apply flex justify-between gap-4 p-4 text-primary text-body-sm;
}
.action-wrapper {
  @apply flex items-center gap-2;
}
</style>
