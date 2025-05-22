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
                :key="user.id"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-4">
                  <img
                    :src="user.avatar"
                    alt="프로필"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-semibold text-sm">{{ user.username }}</p>
                    <p class="text-gray-500 text-xs">{{ user.name }}</p>
                  </div>
                </div>
                <button
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm"
                  @click="unblock(user.id)"
                >
                  해제
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProfileMenu from '../../profile/components/ProfileMenu.vue';

const blockedUsers = ref([
  {
    id: 1,
    username: 'ji.__zzx',
    name: '임지우',
    avatar: 'https://example.com/avatar1.jpg',
  },
  {
    id: 2,
    username: 'sellojellomello',
    name: '정민',
    avatar: 'https://example.com/avatar2.jpg',
  },
  {
    id: 3,
    username: 'h.chaxnce',
    name: '홍채은',
    avatar: 'https://example.com/avatar3.jpg',
  },
]);

const unblock = (id) => {
  blockedUsers.value = blockedUsers.value.filter((u) => u.id !== id);
};
</script>
