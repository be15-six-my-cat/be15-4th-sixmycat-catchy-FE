<template>
  <div class="flex">
    <ProfileMenu />
    <div class="flex-1 p-6">
      <div class="flex justify-center">
        <div class="w-full max-w-[800px]">
          <BlockList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfileMenu from '../../profile/components/ProfileMenu.vue';
import BlockList from '@/features/block/components/BlockList.vue';
</script>
