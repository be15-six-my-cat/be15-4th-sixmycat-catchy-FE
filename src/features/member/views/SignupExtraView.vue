<script setup>
import { ref, onMounted } from 'vue';
import CatFormModal from '@/features/profile/components/CatFormModal.vue';
import { fetchMyProfile, addNewCat, deleteCat } from '@/api/profile';
import { useToast } from 'vue-toastification';
import axios from '@/api/axios'; // ✅ 설정된 axios 인스턴스 사용

const toast = useToast();

const nickname = ref('');
const statusMessage = ref('');
const cats = ref([]);
const showCatModal = ref(false);
const editIndex = ref(null);
const deletedCatIds = ref([]);

const imageUrl = ref('https://placekitten.com/200/200');
const imageFile = ref(null);
const imageInput = ref(null);

onMounted(async () => {
  try {
    const res = await fetchMyProfile();
    nickname.value = res.nickname;
    statusMessage.value = res.statusMessage;
    imageUrl.value = res.profileImage;
    cats.value = res.cats || [];
  } catch (e) {
    console.error('프로필 불러오기 실패', e);
    toast.error('프로필 정보를 불러오지 못했습니다.');
  }
});

function openAddCat() {
  editIndex.value = null;
  showCatModal.value = true;
}

function triggerImageUpload() {
  imageInput.value?.click();
}

function handleImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  imageFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleAddCat(cat) {
  if (editIndex.value !== null) {
    cats.value[editIndex.value] = cat;
    editIndex.value = null;
  } else {
    cats.value.push(cat);
  }
  showCatModal.value = false;
}

function handleDeleteCat(cat) {
  if (!cat || !cat.id) return;

  cats.value = cats.value.filter((c) => c.id !== cat.id);
  deletedCatIds.value.push(cat.id);
}

function openEditCat(index) {
  editIndex.value = index;
  showCatModal.value = true;
}

async function saveProfile() {
  try {
    const existingCats = cats.value.filter((cat) => cat.id != null);
    const newCats = cats.value.filter((cat) => cat.id == null);

    const payload = {
      nickname: nickname.value,
      statusMessage: statusMessage.value,
      cats: existingCats,
    };

    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    if (imageFile.value) {
      formData.append('imageFile', imageFile.value);
    }

    await axios.patch('/api/v1/profiles/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    for (const cat of newCats) {
      await addNewCat(cat); // 인증 토큰 자동 포함
    }

    for (const catId of deletedCatIds.value) {
      await deleteCat(catId);
    }

    toast.success('저장되었습니다!');
  } catch (error) {
    console.error('저장 실패:', error);
    toast.error('저장 실패');
  }
}
</script>

<template>
  <div class="main-frame">
    <div class="signup-button-frame">
      <BasicButton
        text="회원가입 하기"
        backgroundColor="#ff5c8d"
        textColor="#ffffff"
        @click="submitSignup"
      />
    </div>

    <!-- 프로필 이미지 및 아이콘 -->
    <div class="profile-frame">
      <img
        :src="previewImage"
        alt="프로필 이미지"
        class="profile-image"
        @click="triggerImageInput"
      />
      <img
        src="@/assets/images/member/camera-pink.png"
        class="camera-icon"
        @click="triggerImageInput"
        alt="image add"
      />
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        class="file-input-hidden"
        @change="handleImageChange"
      />
    </div>

    <h2 class="title">추가 정보 입력</h2>

    <!-- 입력 폼 -->
    <div class="inputs-frame">
      <Input
        title="이름"
        text="이름을 입력해주세요 (후에 수정 불가)"
        v-model="name"
        :readonly="nameReadonly"
      />
      <Input
        title="전화번호"
        text="- 없이 전화번호를 입력해주세요 (후에 수정 불가)"
        v-model="contactNumber"
        :readonly="contactReadonly"
        @input="handleContactInput"
      />
      <Input
        title="닉네임"
        text="영어, 숫자, 특수문자 (., _, ^)만 가능합니다"
        v-model="nickname"
        @input="handleNicknameInput"
      />
      <!-- ✅ 고양이 정보 항목 추가 -->
      <label class="input-title">고양이 정보</label>
      <p v-if="cats.length === 0" class="input-desc">
        아직 등록된 고양이가 없습니다.
      </p>

      <div
        v-for="(cat, index) in cats"
        :key="index"
        @click="openEditCat(index)"
        class="input-box cat-box"
      >
        {{ cat.name }} · {{ cat.breed }} · {{ cat.gender }}
      </div>

      <button class="input-box cat-add-btn" @click="openAddCat">
        고양이 추가
      </button>
    </div>

    <!-- 고양이 모달 -->
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
.main-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-top: 80px;
}

.profile-frame {
  position: relative;
  width: 100px;
  height: 100px;
}

.profile-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #ddd;
  cursor: pointer;
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.file-input-hidden {
  display: none;
}

.inputs-frame {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}

.signup-button-frame {
  display: flex;
  justify-content: flex-end;
  width: 370px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.input-title {
  font-size: 14px;
  color: #757575;
  margin-top: 12px;
  line-height: 1.5;
  border-style: hidden;
  width: 315px;
}

.input-desc {
  font-size: 14px;
  color: #757575;
  margin-top: 12px;
}

.input-box {
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  padding: 10px 12px;
  background-color: #fff;
  transition: all 0.2s ease;
  width: 337px;
  text-align: left;
}

.cat-box {
  cursor: pointer;
  margin-bottom: 8px;
}
.cat-box:hover {
  background-color: #ffe5ec;
  color: #ff5c8d;
}

.cat-add-btn {
  color: #ff5c8d;
  font-weight: 500;
  text-align: center;
  border: 1px solid #ff5c8d;
}
.cat-add-btn:hover {
  background-color: #ffe5ec;
  color: white;
}

.input
{
  background-color:#ffffff;
  height:40px;
  width:337px;
  border-radius:8px;
  padding-left:11px;
  padding-right:11px;
  padding-top:11px;
  padding-bottom:9px;
  display:flex;
  flex-direction:column;
  top:30px;
  position:relative;
}

</style>
