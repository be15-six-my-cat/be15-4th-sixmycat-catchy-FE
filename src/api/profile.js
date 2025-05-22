import axios from './axios'

export async function fetchMyProfile() {
  const { data } = await axios.get('/profiles/me')
  return data
}
