import api from './axios.js';

export const uploadImages = (data) => api.post('/feed/images', data);

export const createFeed = (data) =>
  api.post('/feeds', data, {
    headers: {
      'X-USER-ID': 1,
    },
  });

export const fetchFeedList = (params = { page: 0, size: 2 }) =>
  api.get('/feeds', {
    params,
    headers: {
      'X-USER-ID': 1,
    },
  });

export const fetchFeed = (feedId) =>
  api.get(`/feeds/${feedId}`, {
    headers: {
      'X-USER-ID': 1,
    },
  });
