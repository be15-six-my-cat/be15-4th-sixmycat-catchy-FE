<script setup>
import defaultProfileImage from '@/assets/default_images/01_cat.png';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const { notification } = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const showFollow = ref(notification.type === 'FOLLOW');
const isFollowing = ref(true);

function getTimeAgo(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) {
    return `${diffSeconds}초`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분`;
  } else if (diffHours < 24) {
    return `${diffHours}시간`;
  } else if (diffDays < 7) {
    return `${diffDays}일`;
  } else {
    return `${diffWeeks}주`;
  }
}

const timeAgo = computed(() => getTimeAgo(notification.createdAt));

const notificationText = computed(() => {
  switch (notification.type) {
    case 'FOLLOW':
      return `님이 회원님을 팔로우하기 시작했습니다.`;
    case 'COMMENT':
      return `님이 회원님의 게시물에 댓글을 남겼습니다.`;
    case 'RECOMMENT':
      return `님이 회원님의 댓글에 답글을 남겼습니다.`;
    case 'LIKE':
      return `님이 회원님의 피드/쭈르 을(를) 좋아합니다.`;
    case 'BIRTHDAY':
      return `님의 냥이 생일 축하해요! 🐾🎂🐱🎉`;
    default:
      return '';
  }
});

function goToProfile() {}

function toggleFollow() {
  // todo : 팔로우 api 호출 후 상태 변경
  isFollowing.value = !isFollowing.value;
}

// todo : 타회원 프로필 조회 api 호출
</script>

<template>
  <div class="flex items-center gap-2">
    <img
      :src="notification.profileImage ||= defaultProfileImage"
      :alt="'profileImage'"
      class="profile-image"
      @click="goToProfile"
    />
    <div class="text-start text-sm leading-snug flex-1">
      <span class="font-bold">{{ notification.senderNickname }}</span>
      <span>{{ notificationText }}</span>
      <span></span>
      <span class="text-gray-300 pl-1">{{ timeAgo }}</span>
    </div>
    <button class="following-button" @click.stop="toggleFollow" :class="{ invisible: !showFollow }">
      팔로우
    </button>
  </div>
</template>

<style scoped>
.profile-image {
  @apply w-14 h-14 rounded-full;
}

.following-button {
  @apply bg-primary text-white text-body-sm py-1 px-3 rounded-sm hover:bg-primary-hover;
}
</style>
