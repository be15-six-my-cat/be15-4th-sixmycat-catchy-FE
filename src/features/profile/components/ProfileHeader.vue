<template>
  <div class="flex justify-center">
    <div v-if="user?.member" class="flex items-start gap-6 mb-4 -translate-x-12">
      <!-- 프로필 이미지 -->
      <div class="w-24 h-24 bg-gray-300 rounded-full shrink-0" />

      <div class="flex-1">
        <!-- 닉네임 -->
        <h2 class="text-headline-lg font-bold">{{ user.member.nickname }}</h2>

        <!-- 뱃지 -->
        <div class="flex gap-2 mt-1">
          <span v-if="user.badges?.topRanker" class="badge bg-pink-300 text-white">🏅 랭킹 1등</span>
          <span v-if="user.badges?.influencer" class="badge bg-pink-400 text-white">⭐ 인증유저</span>
          <span v-if="user.badges?.birthday" class="badge bg-pink-200 text-white">🎂 생일</span>
        </div>

        <!-- 상태 메시지 -->
        <p class="text-body-sm text-gray-500 mt-1">
          {{ user.member.statusMessage || '상태메시지가 없습니다.' }}
        </p>

        <!-- 게시물 수 등 -->
        <div class="flex gap-4 mt-2 text-body-md text-gray-700">
          <span>게시물 {{ user.contents?.feedCount ?? 0 }}</span>
          <span>팔로워 {{ user.follows?.followerCount ?? 0 }}</span>
          <span>팔로우 {{ user.follows?.followingCount ?? 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.badge {
  @apply text-xs font-semibold px-2 py-1 rounded-full;
}
</style>
