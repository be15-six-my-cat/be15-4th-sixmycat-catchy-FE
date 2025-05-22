import axios from '@/api/axios'

// 1. 내 프로필 조회
export async function fetchMyProfile() {
  const { data } = await axios.get('/profiles/me')
  return data
}

// 2. 특정 유저 프로필 조회
export async function fetchUserProfile(userId) {
  const { data } = await axios.get(`/profiles/${userId}`)
  return data
}

// 3. 내 프로필 수정
export async function updateMyProfile(payload) {
  const { data } = await axios.patch('/profiles/me', payload)
  return data
}
