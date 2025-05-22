<script setup>
import ProfileSide from '@/features/member/components/ProfileSide.vue';
import ProfileMainEdit from '@/features/member/components/ProfileMainEdit.vue';
</script>

<template>
  <div class="content-frame">
    <ProfileSide :s1="false" :s2="true" :s3="false" :s4="false" />
    <ProfileMainEdit />
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
