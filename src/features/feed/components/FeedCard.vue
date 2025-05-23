<script setup>
import FeedHeader from './FeedHeader.vue';
import FeedCarousel from './FeedCarousel.vue';
import FeedActions from './FeedActions.vue';
import FeedCommentPreview from './FeedCommentPreview.vue';
import { deleteFeed, editFeed, uploadImages } from '@/api/feed.js';
import { showSuccessToast } from '@/utills/toast.js';
import { useFeedRefreshStore } from '@/stores/feedRefreshStore.js';
import UploadGuideModal from '@/components/modal/UploadGuideModal.vue';
import { ref } from 'vue';
import FeedUploadModal from '@/features/feed/components/FeedUploadModal.vue';
import { startLoading } from '@/composable/useLoadingBar.js';
import { useAuthStore } from '@/stores/auth.js';

const showImageEditModal = ref(false);
const showFeedEditModal = ref(false);
const editImageFiles = ref([]);
const editImageUrls = ref([]);
const props = defineProps({ feed: Object });
const feedRefreshStore = useFeedRefreshStore();
const caption = ref(props.feed.content);
const authStore = useAuthStore();

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

const handleEdit = () => {
  showImageEditModal.value = true;
};

const handleImageEditSave = ({ existingUrls = [], files = [] }) => {
  editImageFiles.value = files;
  editImageUrls.value = [...existingUrls, ...files.map((f) => URL.createObjectURL(f))];
  showImageEditModal.value = false;
  showFeedEditModal.value = true;
};

const handleFeedEdit = async () => {
  try {
    startLoading();

    // 1. 새 이미지 업로드
    let uploadedUrls = [];
    if (editImageFiles.value.length > 0) {
      const formData = new FormData();
      editImageFiles.value.forEach((file) => formData.append('files', file));
      const res = await uploadImages(formData);
      uploadedUrls = res.data.data; // 새로 업로드된 S3 URL들
    }

    // 2. 기존 유지 이미지 URL 추출
    const original = props.feed.imageUrls;
    const keepUrls = editImageUrls.value.filter((url) => original.includes(url));

    // 3. 최종 payload 구성
    const finalImageUrls = [...keepUrls, ...uploadedUrls];

    const payload = {
      content: caption.value,
      imageUrls: finalImageUrls,
    };

    // 4. 서버에 수정 요청
    await editFeed(props.feed.id, payload);

    showSuccessToast('피드가 수정되었습니다!');
    feedRefreshStore.triggerRefresh();
    showFeedEditModal.value = false;
  } catch (e) {
    console.error('피드 수정 실패:', e);
    alert('피드 수정 중 오류가 발생했습니다.');
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
      :shareContent="feed.content"
      :shareImage="feed.imageUrls[0]"
    />
    <div class="content-wrapper">
      <router-link
        :to="
          feed.author.authorId == authStore.memberId
            ? '/profile'
            : `/members/${feed.author.nickname}`
        "
      >
        <span class="author">{{ feed.author.nickname }}</span>
      </router-link>
      <span class="content">{{ feed.content }}</span>
    </div>
    <FeedCommentPreview
      :commentCount="feed.commentCount"
      :commentPreview="feed.commentPreview"
      :feedId="feed.id"
    />
    <UploadGuideModal
      v-if="showImageEditModal"
      :initialImages="feed.imageUrls"
      @fileSelected="handleImageEditSave"
      @close="showImageEditModal = false"
    />

    <FeedUploadModal
      v-if="showFeedEditModal"
      v-model:caption="caption"
      :imageUrls="editImageUrls"
      @upload="handleFeedEdit"
      @close="showFeedEditModal = false"
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

.author {
  @apply text-xs font-semibold;
}

.content-wrapper .content {
  @apply text-sm text-gray-800;
}
</style>
