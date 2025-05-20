<script setup>
import FeedHeader from './FeedHeader.vue';
import FeedCarousel from './FeedCarousel.vue';
import FeedActions from './FeedActions.vue';
import FeedCommentPreview from './FeedCommentPreview.vue';

defineProps({ feed: Object });
</script>

<template>
  <div class="feed-card">
    <FeedHeader :author="feed.author" :createdAt="feed.createdAt" />
    <FeedCarousel :images="feed.imageUrls" />
    <FeedActions
      :likeCount="feed.likeCount"
      :commentCount="feed.commentCount"
      :liked="feed.liked"
    />
    <div class="content-wrapper">
      <span class="author">{{ feed.author.nickname }}</span>
      <span class="content">{{ feed.content }}</span>
    </div>
    <FeedCommentPreview :commentCount="feed.commentCount" :commentPreview="feed.commentPreview" />
  </div>
</template>

<style scoped>
.feed-card {
  @apply w-full max-w-[560px] rounded-xl bg-white shadow-base border border-gray-200;
}

.content-wrapper {
  @apply flex flex-col px-4 gap-2;
}

.content-wrapper .author {
  @apply text-xs font-semibold;
}

.content-wrapper .content {
  @apply text-sm text-gray-800;
}
</style>
