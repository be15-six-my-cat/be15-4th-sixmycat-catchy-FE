<script setup>
import { ref, onUnmounted } from 'vue';
import { useUploadStore } from '@/stores/uploadStore';
import SidebarMainLayout from '@/components/layout/SidebarMainLayout.vue';
import UploadGuideModal from '@/components/modal/UploadGuideModal.vue';
import JjureUploadModal from '@/features/jjure/components/JjureUploadModal.vue';
import { getPresignedUrl, uploadFileToS3, saveJjureMeta } from '@/api/jjure.js';
import FeedUploadModal from '@/features/feed/components/FeedUploadModal.vue';
import { createFeed, uploadImages } from '@/api/feed.js';
import { showSuccessToast } from '@/utills/toast.js';
import { startLoading } from '@/composable/useLoadingBar.js';

const showUploadGuideModal = ref(false);
const showJjureUploadModal = ref(false);
const showFeedUploadModal = ref(false);
const imageUrls = ref([]);
const imageFiles = ref([]);
const videoUrl = ref('');
const caption = ref('');

const uploadStore = useUploadStore();

// 파일 선택 핸들러
function handleFilesSelected(files) {
  if (!files.length) return;

  const file = files[0];

  const isVideo = file.type.startsWith('video/');
  const isAllImages = files.every((f) => f.type.startsWith('image/'));

  if (isVideo && files.length === 1) {
    uploadStore.setFile(file);
    videoUrl.value = URL.createObjectURL(file);
    showUploadGuideModal.value = false;
    showJjureUploadModal.value = true;
    return;
  }

  if (isAllImages) {
    imageFiles.value = files;
    imageUrls.value = files.map((f) => URL.createObjectURL(f));
    showUploadGuideModal.value = false;
    showFeedUploadModal.value = true;
  }
}

// 업로드 처리 핸들러
async function handleUpload() {
  const file = uploadStore.selectedFile;
  if (!file) return;

  console.log(file);

  try {
    const { presignedUrl, fileKey } = await getPresignedUrl(file.name, file.type);
    startLoading();

    await uploadFileToS3(presignedUrl, file);

    await saveJjureMeta({ fileKey, caption: caption.value });

    showSuccessToast('쭈르 업로드에 성공했습니다!!');
  } catch (error) {
    console.error('업로드 실패:', error);
    alert('업로드 중 오류가 발생했습니다.');
  } finally {
    showJjureUploadModal.value = false;
    URL.revokeObjectURL(videoUrl.value);
    videoUrl.value = '';
    caption.value = '';
    uploadStore.setFile(null);
  }
}

async function handleFeedUpload() {
  try {
    const formData = new FormData();
    imageFiles.value.forEach((file) => formData.append('files', file));

    const res = await uploadImages(formData);
    const uploadedImageUrls = res.data.data;

    const payload = {
      content: caption.value,
      imageUrls: uploadedImageUrls,
    };

    await createFeed(payload);

    alert('피드 업로드 성공!');
    showFeedUploadModal.value = false;

    imageFiles.value = [];
    imageUrls.value.forEach((url) => URL.revokeObjectURL(url));
    imageUrls.value = [];
    caption.value = '';
  } catch (err) {
    console.error('피드 업로드 실패:', err);
    const errorCode = err.response?.data?.errorCode;
    console.log('errorCode=', errorCode);
    if (errorCode === '04004') {
      alert('강아지 이미지가 발견되었습니다. 고양이만 등록해주세요~^^');
    } else {
      alert('피드 업로드 중 오류 발생');
    }
  }
}

// 메모리 정리
onUnmounted(() => {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value);
  }
});
</script>

<template>
  <div>
    <!-- 사이드바 포함 전체 레이아웃 -->
    <SidebarMainLayout @open-upload-modal="showUploadGuideModal = true">
      <RouterView />
    </SidebarMainLayout>

    <!-- 파일 업로드 안내 모달 -->
    <UploadGuideModal
      v-if="showUploadGuideModal"
      @close="showUploadGuideModal = false"
      @fileSelected="handleFilesSelected"
    />

    <FeedUploadModal
      v-if="showFeedUploadModal"
      @close="showFeedUploadModal = false"
      v-model:caption="caption"
      @upload="handleFeedUpload"
      :imageUrls="imageUrls"
    />

    <!-- 쭈르 업로드 모달 -->
    <JjureUploadModal
      v-if="showJjureUploadModal"
      :videoUrl="videoUrl"
      v-model:caption="caption"
      @close="showJjureUploadModal = false"
      @upload="handleUpload"
    />
  </div>
</template>
