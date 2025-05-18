// 📁 src/api/upload.js
import api from '@/api/axios.js';
import axios from 'axios'; // S3에 직접 업로드할 때는 별도로 사용

/* 1. Presigned URL 요청 */
export async function getPresignedUrl(filename, contentType) {
  const encodedFilename = encodeURIComponent(filename);
  const encodedContentType = encodeURIComponent(contentType);

  const res = await api.get(
    `/jjure/upload/presigned-url?filename=${encodedFilename}&contentType=${encodedContentType}`,
  );
  return res.data.data;
}

/* 2. S3로 파일 업로드 (Presigned URL 사용) */
export async function uploadFileToS3(presignedUrl, file) {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
      'x-amz-acl': 'private',
    },
  });
}

/* 3. 서버에 업로드된 파일 메타정보 저장 */
export async function saveJjureMeta(payload) {
  await api.post('/jjure/upload', payload);
}
