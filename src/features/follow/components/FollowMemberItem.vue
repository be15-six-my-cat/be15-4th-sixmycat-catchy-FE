<script setup>
import defaultProfileImage from '@/assets/default_images/01_cat.png';

const { member } = defineProps({
  member: {
    type: Object,
    required: true,
  },
});

function goToProfile() {
  // todo : 타회원 프로필 조회 api 호출
}

const deleteFollow = async (memberId) => {
  // try {
  //   const res = await /* todo : api 추가*/
  //   if (res.status === 200) {
  //     emit('follow-deleted', memberId)
  //   }
  // } catch (err) {
  //   console.error('팔로우 취소 실패:', err)
  // }
};
</script>

<template>
  <div class="flex items-center gap-4 py-4 px-7">
    <div>
      <img
        :src="member.profileImage ||= defaultProfileImage"
        :alt="'profileImage'"
        class="profile-image"
        @click="goToProfile"
      />
    </div>
    <div class="flex-grow text-left">
      {{ member.nickname }}
    </div>
    <div>
      <button
        class="bg-gray-200 py-1 px-3 text-body-sm rounded-md"
        @click="deleteFollow(member.memberId)"
      >
        삭제
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-image {
  @apply w-12 h-12 rounded-full;
}
</style>
