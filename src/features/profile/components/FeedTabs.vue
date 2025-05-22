<script setup>
import { ref } from 'vue'

const tabs = ['피드', '쮸르', '피드 좋아요', '쮸르 좋아요']
const currentTab = ref('피드') // 기본 활성 탭
</script>

<template>
  <div class="flex justify-center mt-6 mb-4">
    <div class="flex gap-6 border-b border-gray-200 w-[400px] font-sans text-body-md">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="[
          'pb-2 transition-colors duration-200',
          currentTab === tab
            ? 'text-primary border-b-2 border-primary font-semibold'
            : 'text-gray-400'
        ]"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>
