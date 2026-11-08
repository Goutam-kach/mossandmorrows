import { expect, test } from '@playwright/test';

test('home page presents the studio and featured collection', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Morrow & Moss' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The collection' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(3);
});

test('collection filters show the selected category', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /To wear/ }).click();
  await expect(page.locator('.product-card:visible')).toHaveCount(1);
  await page.getByRole('button', { name: /For home/ }).click();
  await expect(page.locator('.product-card:visible')).toHaveCount(2);
});

test('mobile navigation opens and product inquiry preselects the item', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'Ask about this piece' }).first().click();
  await expect(page).toHaveURL(/custom-orders\/\?piece=sunday-market-tote/);
  await expect(page.locator('#piece')).toHaveValue('sunday-market-tote');
});

test('layout has no horizontal overflow on a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});
