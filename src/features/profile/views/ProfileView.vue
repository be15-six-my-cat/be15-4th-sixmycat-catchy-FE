<template>
  <div class="flex">
    <ProfileMenu />

    <div class="flex-1 p-6">
      <!-- ✅ 로딩 중 -->
      <div v-if="!user">
        <p class="text-gray-400">프로필 정보를 불러오는 중...</p>
      </div>

      <!-- ✅ 유저 데이터가 있을 때만 렌더링 -->
      <div v-else>
        <div class="flex justify-center">
          <div class="w-full max-w-[1000px]">
            <ProfileHeader v-if="user?.member" :user="user" />
          </div>
        </div>
        <PetSlider v-if="user?.cats?.length" :pets="user.cats" />
        <FeedTabs />
        <FeedGallery v-if="user?.feedImages" :images="user.feedImages" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProfileMenu from '../components/ProfileMenu.vue'
import ProfileHeader from '../components/ProfileHeader.vue'
import PetSlider from '../components/PetSlider.vue'
import FeedTabs from '../components/FeedTabs.vue'
import FeedGallery from '../components/FeedGallery.vue'
import { fetchMyProfile, fetchUserProfile } from '../api'

const route = useRoute()
const user = ref(null)

const loadProfile = async () => {
  try {
    const userId = route.params.id
    user.value = userId
      ? await fetchUserProfile(userId)
      : await fetchMyProfile()

    console.log('✅ 프로필 응답:', user.value)
  } catch (e) {
    console.error('❌ 프로필 로딩 실패:', e)
    user.value = null
  }
}

onMounted(() => {
  loadProfile()
})

watch(() => route.params.id, () => {
  loadProfile()
})
</script>
