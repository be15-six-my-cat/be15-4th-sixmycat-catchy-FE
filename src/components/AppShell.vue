<script setup>
import { ref, onUnmounted } from 'vue';
import { useUploadStore } from '@/stores/uploadStore';
import SidebarMainLayout from '@/components/layout/SidebarMainLayout.vue';
import UploadGuideModal from '@/components/modal/UploadGuideModal.vue';
import JjureUploadModal from '@/features/jjure/components/JjureUploadModal.vue';
import { getPresignedUrl, uploadFileToS3, saveJjureMeta } from '@/api/jjure.js';

const showUploadGuideModal = ref(false);
const showJjureUploadModal = ref(false);
const videoUrl = ref('');
const caption = ref('');

const uploadStore = useUploadStore();

// 파일 선택 핸들러
function handleFilesSelected(files) {
  if (!files.length) return;

  const file = files[0];
  uploadStore.setFile(file);
  showUploadGuideModal.value = false;

  const type = file.type;
  if (type.startsWith('video/')) {
    videoUrl.value = URL.createObjectURL(file);
    showJjureUploadModal.value = true;
  }
}

// 업로드 처리 핸들러
async function handleUpload() {
  const file = uploadStore.selectedFile;
  if (!file) return;

  console.log(file);

  try {
    const { presignedUrl, fileKey } = await getPresignedUrl(file.name, file.type);

    await uploadFileToS3(presignedUrl, file);

    await saveJjureMeta({ fileKey, caption: caption.value });

    alert('쭈르 업로드 성공!');
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
    <SidebarMainLayout @open-upload-modal="showUploadGuideModal = true" />

    <!-- 파일 업로드 안내 모달 -->
    <UploadGuideModal
      v-if="showUploadGuideModal"
      @close="showUploadGuideModal = false"
      @fileSelected="handleFilesSelected"
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
