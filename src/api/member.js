/* user 관련 api 호출 */
import api from './axios.js';

/* 로그인 */
export function loginUserTest(data) {
  return api.post('/members/login/test', data);
}
