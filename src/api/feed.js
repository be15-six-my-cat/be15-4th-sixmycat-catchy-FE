import api from './axios.js'

export const uploadImages = (data) =>
  api.post('/feed/images', data)

export const createFeed = (data) =>
  api.post('/feeds', data, {
    headers: {
      'X-USER-ID': 1,
    },
  })
