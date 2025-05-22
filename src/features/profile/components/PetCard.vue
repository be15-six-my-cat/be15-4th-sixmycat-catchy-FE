<script setup>
defineProps({
  pet: {
    type: Object,
    required: true
  }
})

const genderMap = {
  F: '암컷',
  M: '수컷',
}

function formatDate(date) {
  return date?.slice(0, 10) || '정보 없음'
}
</script>

<template>
  <div class="w-[500px] bg-pink-50 border border-pink-100 rounded-xl p-6 shadow-sm">
    <ul class="text-sm leading-relaxed text-gray-800">
      <li class="mb-1">
        <span class="font-semibold text-pink-500">🎀 이름:</span> {{ pet.name }}
      </li>
      <li class="mb-1">
        <span class="font-semibold text-pink-500">🎁 성별:</span> {{ genderMap[pet.gender] || '미정' }}
      </li>
      <li class="mb-1">
        <span class="font-semibold text-pink-500">🐾 품종:</span> {{ pet.breed }}
      </li>
      <li>
        <span class="font-semibold text-pink-500">🎂 생일:</span> {{ formatDate(pet.birthDate) }}
      </li>
    </ul>
  </div>
</template>


