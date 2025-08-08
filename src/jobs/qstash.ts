import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function enqueue(
  url: string,
  body: unknown,
  retries = 3,
) {
  await qstash.publishJSON({ url, body, retries });
}
