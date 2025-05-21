<script setup>
import FeedHeader from './FeedHeader.vue';
import FeedCarousel from './FeedCarousel.vue';
import FeedActions from './FeedActions.vue';
import FeedCommentPreview from './FeedCommentPreview.vue';
import { deleteFeed } from '@/api/feed.js';
import { showSuccessToast } from '@/utills/toast.js';
import { useRouter } from 'vue-router';
import { useFeedRefreshStore } from '@/stores/feedRefreshStore.js';

const props = defineProps({ feed: Object });
const feedRefreshStore = useFeedRefreshStore();

const handleDelete = async () => {
  const confirmDelete = confirm('정말 삭제하시겠습니까?');
  if (!confirmDelete) return;

  try {
    await deleteFeed(props.feed.id);
    showSuccessToast('삭제되었습니다.');
    feedRefreshStore.triggerRefresh();
  } catch (e) {
    console.error(e);
    alert('삭제 중 오류 발생');
  }
};
</script>

<template>
  <div class="feed-card">
    <FeedHeader
      :author="feed.author"
      :createdAt="feed.createdAt"
      :mine="feed.mine"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <FeedCarousel :images="feed.imageUrls" :feedId="feed.id" />
    <FeedActions
      :likeCount="feed.likeCount"
      :commentCount="feed.commentCount"
      :liked="feed.liked"
      :feedId="feed.id"
    />
    <div class="content-wrapper">
      <span class="author">{{ feed.author.nickname }}</span>
      <span class="content">{{ feed.content }}</span>
    </div>
    <FeedCommentPreview
      :commentCount="feed.commentCount"
      :commentPreview="feed.commentPreview"
      :feedId="feed.id"
    />
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
