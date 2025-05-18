<script setup>
const props = defineProps({
  videoUrl: { type: String, required: true },
  caption: { type: String, default: '' },
});

const emit = defineEmits(['close', 'upload', 'update:caption']);
</script>

<template>
  <section class="overlay" @click.self="emit('close')">
    <article class="reel-modal">
      <!-- 🎞 동영상 미리보기 -->
      <div class="video-preview">
        <video controls>
          <source :src="videoUrl" type="video/mp4" />
          브라우저가 비디오를 지원하지 않습니다.
        </video>
      </div>

      <!-- 📝 업로드 설명 입력 폼 -->
      <form class="reel-form" @submit.prevent="emit('upload')">
        <div class="input-group">
          <label for="reel-caption" class="label">쭈르 설명</label>
          <textarea
            id="reel-caption"
            class="textarea"
            placeholder="쭈르 설명을 입력하세요"
            :value="caption"
            @input="emit('update:caption', $event.target.value)"
          ></textarea>
        </div>

        <button type="submit" class="submit-button">쭈르 업로드</button>
      </form>
    </article>
  </section>
</template>

<style scoped>
.overlay {
  @apply fixed inset-0 bg-black-alpha-60 flex justify-center items-center z-50;
}

.reel-modal {
  @apply w-[860px] min-h-[600px] flex bg-white rounded-lg overflow-hidden shadow-elevated;
}

.video-preview {
  @apply flex-1 bg-black flex items-center justify-center;
}

.video-preview video {
  @apply w-full h-full object-cover;
}

.reel-form {
  @apply w-[300px] p-6 flex flex-col justify-between;
}

.input-group {
  @apply flex flex-col gap-1 mt-3;
}

.label {
  @apply text-body-sm text-gray-700;
}

.textarea {
  @apply w-full h-[150px] resize-none border border-gray-300 rounded-md p-2 text-body-sm;
}

.submit-button {
  @apply bg-primary text-white text-body-sm py-3 px-4 rounded-md mt-4 hover:bg-primary-hover;
}
</style>
