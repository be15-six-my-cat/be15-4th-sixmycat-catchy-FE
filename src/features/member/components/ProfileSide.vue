<script setup>
import ProfileSideItem from '@/features/member/components/ProfileSideItem.vue';

const props = defineProps({
  s1: { type: Boolean, default: false },
  s2: { type: Boolean, default: false },
  s3: { type: Boolean, default: false },
  s4: { type: Boolean, default: false },
});
</script>

<template>
  <div class="side-frame">
    <div class="header-frame">
      <span class="header-text">계정</span>
    </div>
    <div class="item-frame">
      <ProfileSideItem text="프로필" :selected="s1" goTo="/profile" />
      <ProfileSideItem text="프로필 수정" :selected="s2" goTo="/profile/edit" />
      <ProfileSideItem text="개인 정보" :selected="s3" goTo="/member/info" />
      <ProfileSideItem text="차단 목록" :selected="s4" goTo="/profile/blocked" />
    </div>
  </div>
</template>

<style scoped>
.side-frame {
  height: 820px;
  width: 265px;
  padding-right: 25px;
  padding-top: 15px;
  padding-bottom: 927px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-frame {
  height: 23px;
  width: 240px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header-text {
  color: #333333;
  text-align: left;
  font-size: 18px;
  border-style: hidden;
  font-family: Anuphan;
  line-height: 1.5;
  width: 240px;
}

.item-frame {
  height: 188px;
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
