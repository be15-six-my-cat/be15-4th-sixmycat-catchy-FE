<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BasicButton from '@/features/member/components/BasicButton.vue';
import Input from '@/features/member/components/Input.vue';
import { getTempMemberInfo, socialSignupExtra } from '@/api/member';
import { useDefaultProfileStore } from '@/stores/defaultProfileStore';
import { showErrorToast, showSuccessToast } from '@/utills/toast.js';
import { startLoading, stopLoading } from '@/composable/useLoadingBar.js';

const router = useRouter();
const defaultProfileStore = useDefaultProfileStore();

const name = ref('');
const contactNumber = ref('');
const nickname = ref('');
const profileImage = ref(null);

const nameReadonly = ref(false);
const contactReadonly = ref(false);

const fileInput = ref(null);

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const social = urlParams.get('social');

// 미리보기 이미지: 업로드 이미지 있으면 그거, 없으면 랜덤 기본 이미지
const previewImage = computed(() =>
  profileImage.value ? URL.createObjectURL(profileImage.value) : defaultProfileStore.image,
);

// 이미지 선택 창 열기
const triggerImageInput = () => {
  fileInput.value?.click();
};

// 이미지 선택 시 파일 저장 및 기본 이미지 덮어쓰기
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    profileImage.value = file;
  }
};

// 초기 데이터 세팅
onMounted(async () => {
  // 랜덤 기본 프로필 이미지 설정
  if (!defaultProfileStore.hasImage) {
    defaultProfileStore.setProfileImage();
  }

  if (!email || !social) {
    showErrorToast('잘못된 접근입니다. 이메일 또는 소셜 정보가 누락되었습니다.');
    return;
  }

  try {
    const res = await getTempMemberInfo(email, social.toUpperCase());
    const data = res.data.data;

    if (data.name) {
      name.value = data.name;
      nameReadonly.value = true;
    }
    if (data.contactNumber) {
      contactNumber.value = data.contactNumber;
      contactReadonly.value = true;
    }
  } catch (err) {
    showErrorToast('회원 정보를 불러오지 못했습니다. 다시 시도해주세요.');
    router.push('/member/start');
  }
});

// 회원가입 제출
const submitSignup = async () => {
  try {
    startLoading();
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('contactNumber', contactNumber.value.replace(/-/g, ''));
    formData.append('nickname', nickname.value);
    formData.append('email', email);
    formData.append('social', social.toUpperCase());

    if (profileImage.value) {
      formData.append('profileImage', profileImage.value);
    }

    const { data } = await socialSignupExtra(formData);

    showSuccessToast('Catchy에 오신 것을 환영합니다!');
    defaultProfileStore.clearProfileImage();
    router.push('/feed');
    stopLoading();
  } catch (error) {
    const { errorCode, message } = error.response?.data ?? {};
    showSuccessToast(`${message ?? '알 수 없는 오류가 발생했습니다.'}`);
  }
};
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
        src="@/assets/images/member/camera-pink.png "
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
      />
      <Input title="닉네임" text="영어, 숫자, 특수문자 (., _, ^)만 가능합니다" v-model="nickname" />
    </div>
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
</style>
