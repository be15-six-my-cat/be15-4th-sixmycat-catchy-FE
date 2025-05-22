import api from './axios.js';

export const likeFeed = (data) => api.post('/likes', data);

export const unLikeFeed = (data) =>
  api.delete('/likes', {
    data,
  });
