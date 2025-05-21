<script setup>
import { ref, onMounted } from 'vue';
import BasicButton from '@/features/member/components/BasicButton.vue';
import Input from '@/features/member/components/Input.vue';
import { getTempMemberInfo, socialSignupExtra } from '@/api/member';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const contactNumber = ref('');
const nickname = ref('');
const profileImage = ref(null);
const nameReadonly = ref(false);
const contactReadonly = ref(false);

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const social = urlParams.get('social');

onMounted(async () => {
  if (!email || !social) {
    alert('잘못된 접근입니다. 이메일 또는 소셜 정보가 누락되었습니다.');
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
    console.error('임시 회원 정보 불러오기 실패:', err);
    alert('임시 회원 정보를 불러오지 못했습니다.');
  }
});

const handleImageChange = (e) => {
  profileImage.value = e.target.files[0];
};

const submitSignup = async () => {
  try {
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
    alert('회원가입이 완료되었습니다!');
    router.push('/member/start');
  } catch (error) {
    const { errorCode, message } = error.response?.data ?? {};
    alert(`[${errorCode ?? 'ERROR'}] ${message ?? '알 수 없는 오류가 발생했습니다.'}`);
    console.error('회원가입 실패:', error);
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
    <div class="inputs-frame">
      <Input
        title="이름"
        text="이름을 입력해주세요 (후에 수정 불가)"
        v-model="name"
        :readonly="nameReadonly"
      />
      <Input
        title="전화번호"
        text="전화번호를 입력해주세요 (후에 수정 불가)"
        v-model="contactNumber"
        :readonly="contactReadonly"
      />
      <Input title="닉네임" text="영어 및 특수문자(., _, ^)만 입력 가능합니다" v-model="nickname" />
      <input type="file" accept="image/*" @change="handleImageChange" />
    </div>
  </div>
</template>

<style scoped>
.main-frame {
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  padding-top: 180px;
}

.signup-button-frame {
  height: 44px;
  width: 790px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.inputs-frame {
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
</style>
