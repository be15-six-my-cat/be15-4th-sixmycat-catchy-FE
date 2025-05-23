<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';

const props = defineProps({
  id: Number,
  fileKey: String,
  authorNickname: String,
  authorImageUrl: String,
  caption: String,
  musicTitle: String,
  commentPreview: String,
  likeCount: Number,
  commentCount: Number,
});

const router = useRouter();

function goToDetail() {
  router.push(`/jjure/${props.id}`);
}

const videoUrl = computed(
  () =>
    `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${props.fileKey}`,
);

const formattedLikeCount = computed(() =>
  props.likeCount >= 10000 ? `${Math.floor(props.likeCount / 1000)}K` : props.likeCount,
);

const formattedCommentCount = computed(() =>
  props.commentCount >= 10000 ? `${Math.floor(props.commentCount / 1000)}K` : props.commentCount,
);
</script>

<template>
  <div class="jjure-card" @click="goToDetail">
    <div class="video-wrapper">
      <video autoplay muted loop playsinline>
        <source :src="videoUrl" type="video/mp4" />
        브라우저가 비디오를 지원하지 않습니다.
      </video>
      <div class="reel-actions">
        <div class="icon-wrapper">
          <i class="fa-regular fa-heart"></i>
          <div class="action-count">{{ formattedLikeCount }}</div>
        </div>
        <RouterLink :to="`/jjure/${id}`" class="icon-wrapper">
          <i class="fa-regular fa-comment"></i>
          <div class="action-count">{{ formattedCommentCount }}</div>
        </RouterLink>
        <div class="icon-wrapper"><i class="fa-solid fa-share-nodes"></i></div>
      </div>
    </div>

    <div class="caption-box">
      <div class="title">
        <RouterLink :to="`/members/${authorNickname}`" class="nickname hover:underline">
          @{{ authorNickname }}
        </RouterLink>
        <span class="caption">{{ caption }}</span>
      </div>
      <div class="comment-preview" v-if="commentPreview">{{ commentPreview }}</div>
      <div class="music-info" v-if="musicTitle">
        <i class="fa-solid fa-music"></i> {{ musicTitle }}
      </div>
    </div>

    <div class="footer">ⓒ 2025 Catchy</div>
  </div>
</template>

<style scoped>
.jjure-card {
  @apply w-[400px] h-[740px] bg-white rounded-xl overflow-hidden shadow-hover text-black flex flex-col;
}

.video-wrapper {
  @apply relative w-full h-[650px] bg-black;
}

.video-wrapper video {
  @apply w-full h-full object-cover;
}

.reel-actions {
  @apply absolute right-2 bottom-14 flex flex-col gap-4 text-white text-[16px];
}

.icon-wrapper {
  @apply cursor-pointer text-center shadow-[var(--tw-shadow-elevated)] bg-black-alpha-20 rounded-full p-2;
}

.reel-actions i {
  @apply hover:text-primary;
}

.action-count {
  @apply text-[12px] mt-1 text-center;
}

.caption-box {
  @apply bg-white p-3 text-[13px] border-t border-gray-200 text-gray-800;
}

.caption {
  @apply inline-block truncate text-[13px] max-w-[300px] text-gray-700;
}
.title {
  @apply flex items-center;
}
.title .nickname {
  @apply font-bold text-primary mr-2;
}

.comment-preview {
  @apply mt-1 text-[12px] text-gray-900;
}

.music-info {
  @apply mt-2 text-[12px] text-gray-700 flex items-center gap-1;
}

.footer {
  @apply text-center bg-white text-gray-400 text-[11px] py-2 border-t border-gray-200;
}
</style>
