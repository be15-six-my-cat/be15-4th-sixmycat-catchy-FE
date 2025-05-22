/* follow 관련 api 호출 */
import api from './axios.js';

/* 내가 팔로우한 멤버 조회 */
export function getFollowing(page = 1, size = 2) {
  page = page - 1;
  return api.get('/follows/following', {
    params: {
      page,
      size,
    },
  });
}

/* 나를 팔로우한 멤버 조회 */
export function getFollower(page = 1, size = 2) {
  page = page - 1;
  return api.get('/follows/received', {
    params: {
      page,
      size,
    },
  });
}
