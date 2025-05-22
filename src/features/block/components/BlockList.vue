<template>
  <div class="flex">
    <div class="flex-1 p-6">
      <div class="flex justify-center">
        <div class="w-full max-w-[800px]">
          <h2 class="text-2xl font-bold ml-6 mb-6">차단 목록</h2>
          <div class="bg-white rounded-xl shadow p-6">
            <ul class="space-y-4">
              <li
                v-for="user in blockedUsers"
                :key="user.blockedId"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-4">
                  <img
                    :src="user.avatar || defaultAvatar"
                    alt="프로필"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-semibold text-sm">{{ user.blockedNickname }}</p>
                    <p class="text-gray-500 text-xs">{{ formatDate(user.blockedAt) }}</p>
                  </div>
                </div>
                <button
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm"
                  @click="unblock(user.blockedId)"
                >
                  해제
                </button>
              </li>
              <li v-if="blockedUsers.length === 0" class="text-center text-gray-500 text-sm">
                차단한 사용자가 없습니다.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { fetchBlockedUsers, unblockUser } from '@/api/block.js';

const blockedUsers = ref([]);
const defaultAvatar = '/default_avatar.png';
const userId = 1; // TODO: 로그인 사용자 ID로 교체

const loadBlockedUsers = async () => {
  try {
    const res = await fetchBlockedUsers(userId, 1, 50);
    blockedUsers.value = res.data.data.content; // API 구조에 따라 조정
  } catch (error) {
    console.error('❌ 차단 목록 불러오기 실패:', error);
  }
};

const unblock = async (blockedId) => {
  try {
    await unblockUser(userId, blockedId);
    blockedUsers.value = blockedUsers.value.filter((user) => user.blockedId !== blockedId);
  } catch (error) {
    console.error('❌ 차단 해제 실패:', error);
  }
};

const formatDate = (datetime) => dayjs(datetime).format('YYYY.MM.DD HH:mm');

onMounted(loadBlockedUsers);
</script>
