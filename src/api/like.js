import api from './axios.js';

export const likeFeed = (data) =>
  api.post('/likes', data, {
    headers: {
      'X-USER-ID': 1,
    },
  });

export const unLikeFeed = (data) =>
  api.delete('/likes', {
    data,
    headers: {
      'X-USER-ID': 1,
    },
  });
