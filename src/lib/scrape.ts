import { chromium } from 'playwright-core';
import { allowedByRobots, isHostAllowed } from './compliance';

export async function scrape(url: string) {
  const { hostname } = new URL(url);
  if (!isHostAllowed(hostname)) {
    throw new Error('Disallowed host');
  }
  if (!(await allowedByRobots(url))) {
    throw new Error('Blocked by robots.txt');
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();
  await browser.close();
  return html;
}
