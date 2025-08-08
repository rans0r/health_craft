export const DISALLOWED_HOSTS = new Set<string>([
  'example.com',
  'facebook.com',
  'instagram.com',
]);

export function isHostAllowed(host: string): boolean {
  return !DISALLOWED_HOSTS.has(host);
}

export async function allowedByRobots(url: string): Promise<boolean> {
  try {
    const target = new URL(url);
    const robotsUrl = new URL('/robots.txt', target.origin);
    const res = await fetch(robotsUrl);
    if (!res.ok) return true;
    const text = await res.text();
    const lines = text.split(/\r?\n/);
    let relevant = false;
    const disallow: string[] = [];
    for (const line of lines) {
      const lower = line.trim().toLowerCase();
      if (lower.startsWith('user-agent:')) {
        relevant = lower.includes('*');
      } else if (relevant && lower.startsWith('disallow:')) {
        const path = lower.split(':')[1]?.trim() || '';
        disallow.push(path);
      } else if (lower === '') {
        relevant = false;
      }
    }
    return !disallow.some((path) => target.pathname.startsWith(path));
  } catch {
    return false;
  }
}
