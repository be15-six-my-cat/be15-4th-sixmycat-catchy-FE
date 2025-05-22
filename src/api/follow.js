/* follow 관련 api 호출 */
import api from './axios.js';

/* 내가 팔로우한 멤버 조회 */
export function getFollowing(page = 0, size = 20) {
  return api.get('/follows/following', {
    params: {
      page,
      size,
    },
  });
}

/* 나를 팔로우한 멤버 조회 */
export function getFollower(page = 0, size = 20) {
  return api.get('/follows/received', {
    params: {
      page,
      size,
    },
  });
}
