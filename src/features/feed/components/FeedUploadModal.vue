<script setup>
import { ref } from 'vue'

const props = defineProps({
  imageUrls: { type: Array, required: true },
  caption: { type: String, default: '' },
});

const currentIndex = ref(0);

const next = () => {
  if (currentIndex.value < props.imageUrls.length - 1) {
    currentIndex.value++
  }
}
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const emit = defineEmits(['close', 'upload', 'update:caption']);
</script>

<template>
  <section class="overlay" @click.self="emit('close')">
    <article class="reel-modal">
      <div class="image-preview relative">
        <img
          :src="props.imageUrls[currentIndex]"
          class="preview-img"
          alt="preview"
        />
        <button
          v-if="props.imageUrls.length > 1"
          @click="prev"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full"
        >
          ◀
        </button>
        <button
          v-if="props.imageUrls.length > 1"
          @click="next"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full"
        >
          ▶
        </button>
      </div>

      <!-- 설명 입력 -->
      <form class="reel-form" @submit.prevent="emit('upload')">
        <div class="input-group">
          <label for="reel-caption" class="label">피드 설명</label>
          <textarea
            id="reel-caption"
            class="textarea"
            placeholder="피드 설명을 입력하세요"
            :value="caption"
            @input="emit('update:caption', $event.target.value)"
          ></textarea>
        </div>

        <button type="submit" class="submit-button">피드 업로드</button>
      </form>
    </article>
  </section>
</template>
<style scoped>
.overlay {
  @apply fixed inset-0 bg-black-alpha-60 flex justify-center items-center z-50;
}

.reel-modal {
  @apply w-[860px] h-[560px] flex bg-white rounded-lg overflow-hidden shadow-elevated;
}

.image-preview {
  @apply w-[560px] h-[560px] bg-black relative;
}

.preview-img {
  @apply w-full h-full object-cover rounded;
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