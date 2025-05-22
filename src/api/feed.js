import api from './axios.js';

export const uploadImages = (data) => api.post('/feed/images', data);

export const createFeed = (data) => api.post('/feeds', data);

export function fetchFeedList(page = 0, size = 2) {
  return api.get('/feeds');
}

export const fetchFeed = (feedId) => api.get(`/feeds/${feedId}`);

export const editFeed = (feedId, data) => api.put(`/feeds/${feedId}`, data);

export const deleteFeed = (feedId) => api.delete(`/feeds/${feedId}`);

/* 내가 등록한 피드 썸네일 목록 조회 */
export const fetchMyFeedList = (params = { page: 0, size: 9 }) => {
  params.page = params.page - 1;
  return api.get('/feeds/me', {
    params,
  });
};

/* todo : 남이 등록한 피드 썸네일 목록 조회 */

/* 내가 좋아요한 피드 썸네일 목록 조회 */
export const fetchLikedFeedList = (params = { page: 0, size: 9 }) => {
  params.page = params.page - 1;
  return api.get('/feeds/likes', {
    params,
  });
};
