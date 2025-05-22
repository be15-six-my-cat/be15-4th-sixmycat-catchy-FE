<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import ProfileMenu from '../components/ProfileMenu.vue'
import CatFormModal from '../components/CatFormModal.vue'
import { fetchMyProfile, updateMyProfile, addNewCat, deleteCat } from '@/features/profile/api'

const nickname = ref('')
const statusMessage = ref('')
const cats = ref([])
const showCatModal = ref(false)
const editIndex = ref(null)
const deletedCatIds = ref([])

const imageUrl = ref('https://placekitten.com/200/200')
const imageFileName = ref('')
const imageInput = ref(null)

onMounted(async () => {
  try {
    const res = await fetchMyProfile()
    nickname.value = res.nickname
    statusMessage.value = res.statusMessage
    imageUrl.value = res.profileImage // 예: URL 전체

    console.log('imageUrl:', imageUrl.value)

    imageFileName.value = res.profileImage
    cats.value = res.cats || []
  } catch (e) {
    console.error('프로필 불러오기 실패', e)
  }
})

function openAddCat() {
  editIndex.value = null
  showCatModal.value = true
}

function triggerImageUpload() {
  imageInput.value?.click()
}

function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) return
  imageFileName.value = file.name
  const reader = new FileReader()
  reader.onload = e => {
    imageUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function handleAddCat(cat) {
  if (editIndex.value !== null) {
    cats.value[editIndex.value] = cat
    editIndex.value = null
  } else {
    cats.value.push(cat)
  }
  showCatModal.value = false
}

function handleDeleteCat(cat) {
  if (!cat || !cat.id) return

  cats.value = cats.value.filter(c => c.id !== cat.id)

  deletedCatIds.value.push(cat.id)
}


function openEditCat(index) {
  editIndex.value = index
  showCatModal.value = true
}

async function saveProfile() {
  try {
    console.log('nickname:', nickname.value)
    console.log('statusMessage:', statusMessage.value)

    const existingCats = cats.value.filter(cat => cat.id != null)
    const newCats = cats.value.filter(cat => cat.id == null)

    console.log('보내는 cats 데이터:', JSON.stringify(existingCats, null, 2))

    await updateMyProfile({
      nickname: nickname.value,
      statusMessage: statusMessage.value,
      profileImage: imageFileName.value,
      cats: existingCats // PATCH용
    })

    for (const cat of newCats) {
      await addNewCat(cat) // 별도 POST API
    }

    for (const catId of deletedCatIds.value) {
      await deleteCat(catId) // 삭제 API 호출
    }

    alert('저장되었습니다!')
  } catch (error) {
    console.error('저장 실패:', error)
    alert('저장 실패')
  }
}

</script>

<template>
  <div class="flex min-h-screen bg-gray-50 font-sans">
    <ProfileMenu />
    <div class="w-full max-w-screen-xl mx-auto px-6 py-10">
      <div class="flex">
        <section class="flex-1 bg-white p-8 rounded-xl shadow-sm">
          <h1 class="text-headline-md font-bold mb-6">프로필 수정</h1>

          <!-- 이미지 업로드 -->
          <div class="flex flex-col items-center mb-6">
            <img
              :src="imageUrl"
              class="w-24 h-24 rounded-full object-cover mb-2"
              alt="프로필 이미지"
            />
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            />
            <button
              @click="triggerImageUpload"
              class="bg-primary-light text-primary text-sm font-semibold px-3 py-1 rounded-full"
            >
              이미지 변경
            </button>
          </div>

          <!-- 입력 필드 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">닉네임</label>
              <input v-model="nickname" class="w-full border rounded px-3 py-2 text-sm" placeholder="닉네임 수정" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">상태 메시지</label>
              <input v-model="statusMessage" class="w-full border rounded px-3 py-2 text-sm" placeholder="상태 메시지를 입력하세요" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">고양이</label>
              <div class="space-y-2">
                <div
                  v-for="(cat, index) in cats"
                  :key="index"
                  @click="openEditCat(index)"
                  class="w-full border rounded px-3 py-2 text-sm text-gray-800 bg-white cursor-pointer hover:bg-gray-50"
                >
                  {{ cat.name }}
                </div>

                <!-- 고양이 추가 버튼 -->
                <button
                  @click="openAddCat"
                  class="text-primary border border-primary px-3 py-1 text-sm rounded"
                >
                  고양이 추가
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 text-right">
            <button
              @click="saveProfile"
              class="bg-primary text-white px-6 py-2 rounded font-semibold text-sm hover:bg-primary-hover"
            >
              저장하기
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- 고양이 등록/수정 모달 -->
    <CatFormModal
      :visible="showCatModal"
      @close="showCatModal = false"
      @submit="handleAddCat"
      @delete="handleDeleteCat"
      :initial-cat="editIndex !== null ? cats[editIndex] : null"
    />
  </div>
</template>

<style scoped>
</style>
