<script setup>
import BasicModal from '@/components/modal/BasicModal.vue';
import RedButton from '@/features/member/components/RedButton.vue';

defineProps({
  visible: Boolean,
});
const emit = defineEmits(['close']);
</script>

<template>
  <Teleport to="body">
    <BasicModal v-if="visible" @close="emit('close')">
      <div class="content">
        <p>탈퇴를 하면 다시는 기록을 복구할 수 없습니다.<br />그래도 탈퇴하시겠습니까?</p>
        <div class="actions">
          <RedButton @click="handleDelete">탈퇴하기</RedButton>
        </div>
      </div>
    </BasicModal>
  </Teleport>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>
