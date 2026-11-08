import { expect, test } from '@playwright/test';

test('home page presents the studio and featured collection', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Morrow & Moss' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The collection' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await expect(page.locator('.thread-journey-canvas')).toBeAttached();
});

test('a collection item opens its own product page', async ({ page }) => {
  await page.goto('/shop/');
  await page.getByRole('link', { name: 'View Sunday market tote' }).click();
  await expect(page).toHaveURL(/shop\/sunday-market-tote\//);
  await expect(page.getByRole('heading', { name: 'Sunday market tote' })).toBeVisible();
});

test('collection filters show the selected category', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /To wear/ }).click();
  await expect(page.locator('.product-card:visible')).toHaveCount(1);
  await page.getByRole('button', { name: /For home/ }).click();
  await expect(page.locator('.product-card:visible')).toHaveCount(2);
});

test('custom orders explain what happens next', async ({ page }) => {
  await page.goto('/custom-orders/');
  await expect(page.getByRole('heading', { name: 'A few good things to know.' })).toBeVisible();
  await expect(page.getByText('What happens after I send a note?')).toBeVisible();
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
