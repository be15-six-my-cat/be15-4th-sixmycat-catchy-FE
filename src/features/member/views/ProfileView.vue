<script setup>
import ProfileSide from '@/features/member/components/ProfileSide.vue';
import ProfileMain from '@/features/member/components/ProfileMain.vue';
</script>

<template>
  <div class="content-frame">
    <ProfileSide :s1="true" :s2="false" :s3="false" :s4="false" />
    <ProfileMain />
  </div>
</template>

<style scoped>
.content-frame {
  height: 900px;
  width: 950px;
  padding: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
