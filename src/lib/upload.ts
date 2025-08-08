import { put } from '@vercel/blob';

export async function uploadFile(path: string, data: ArrayBuffer) {
  return await put(path, data, {
    access: 'public',
    token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
  });
}
