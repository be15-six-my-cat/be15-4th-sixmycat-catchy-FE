<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white w-[400px] rounded-xl shadow-lg p-6">
      <h2 class="text-lg font-bold mb-4">고양이 정보 등록/수정</h2>

      <!-- 이름 -->
      <label class="block text-sm text-gray-600 mb-1">고양이 이름</label>
      <input v-model="form.name" class="w-full border rounded px-3 py-2 mb-4 text-sm" placeholder="예: 나비" />

      <!-- 성별 -->
      <label class="block text-sm text-gray-600 mb-1">고양이 성별</label>
      <div class="flex gap-2 mb-4">
        <button @click="form.gender = 'F'" :class="['px-3 py-1 rounded border', form.gender === 'F' ? 'bg-primary-light text-primary font-semibold' : '']">
          암컷
        </button>
        <button @click="form.gender = 'M'" :class="['px-3 py-1 rounded border', form.gender === 'M' ? 'bg-primary-light text-primary font-semibold' : '']">
          수컷
        </button>
      </div>

      <!-- 품종 -->
      <label class="block text-sm text-gray-600 mb-1">고양이 품종</label>
      <input v-model="form.breed" class="w-full border rounded px-3 py-2 mb-4 text-sm" placeholder="예: 코숏" />

      <!-- 생일 -->
      <label class="block text-sm text-gray-600 mb-1">고양이 생일</label>
      <input v-model="form.birthDate" type="date" class="w-full border rounded px-3 py-2 text-sm mb-4" />

      <!-- 나이 -->
      <label class="block text-sm text-gray-600 mb-1">고양이 나이</label>
      <input
        v-model.number="form.age"
        type="number"
        class="w-full border rounded px-3 py-2 mb-4 text-sm"
        placeholder="예: 3"
      />

      <div class="flex justify-between mt-6">
        <!-- 왼쪽: 등록 및 삭제 -->
        <div class="flex gap-2">
          <button @click="submit" class="bg-primary text-white px-4 py-2 rounded">등록하기</button>
          <button
            v-if="props.initialCat"
            @click="handleDelete"
            class="bg-primary text-white px-4 py-2 rounded"
          >
            삭제하기
          </button>
        </div>

        <!-- 오른쪽: 취소 -->
        <button @click="close" class="text-primary border border-primary px-4 py-2 rounded">
          취소하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  initialCat: Object // 기존 고양이 데이터 받을 수 있게 추가
})

const emit = defineEmits(['close', 'submit', 'delete'])

const form = reactive({
  name: '',
  gender: '',
  breed: '',
  birthDate: '',
  age: null
})

// 👇 모달이 열릴 때 initialCat이 있으면 form에 복사
watch(
  () => props.initialCat,
  (cat) => {
    if (cat) {
      form.name = cat.name
      form.gender = cat.gender
      form.breed = cat.breed
      form.age = cat.age ?? null;

      // birthDay가 Date나 문자열인 경우 처리
      if (cat.birthDate instanceof Date) {
        form.birthDate = cat.birthDate.toISOString().slice(0, 10)
      } else if (typeof cat.birthDate === 'string') {
        form.birthDate = cat.birthDate.slice(0, 10)
      } else {
        form.birthDate = ''
      }
    } else {
      form.name = ''
      form.gender = ''
      form.breed = ''
      form.birthDate = ''
    }
  },
  { immediate: true }
)

function close() {
  emit('close')
}

function submit() {
  emit('submit', { ...form })
  close()
}

function handleDelete() {
  emit('delete', props.initialCat) // 고양이 정보 전달
  close()
}
</script>
}
