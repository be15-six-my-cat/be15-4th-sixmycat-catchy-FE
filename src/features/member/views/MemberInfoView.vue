<script setup>
import ProfileMenu from '@/features/profile/components/ProfileMenu.vue';
import MemberInfoContent from '@/features/member/components/MemberInfoContent.vue';
</script>

<template>
  <div class="flex">
    <ProfileMenu />

    <div class="content-frame">
      <div class="header-frame">
        <span class="header-text">회원 정보</span>
      </div>
      <MemberInfoContent />
    </div>
  </div>
</template>

<style scoped>
.content-frame {
  height: 820px;
  width: 605px;
  padding-left: 40px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.header-frame {
  height: 31px;
  width: 565px;
  display: flex;
  flex-direction: column;
}

.header-text {
  color: #1e1e1e;
  text-align: left;
  vertical-align: text-top;
  font-size: 24px;
  font-family: Anuphan;
  line-height: 1.5;
  font-weight: bold;
  outline: none;
  width: 565px;
}
</style>
