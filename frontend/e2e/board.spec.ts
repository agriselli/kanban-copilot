import { test, expect } from '@playwright/test';

test('loads kanban board and adds, moves, deletes cards', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText('Kanban Project Manager');
  await expect(page.locator('.column')).toHaveCount(5);
  await expect(page.locator('.card')).toHaveCount(6);

  const sourceHandle = page.locator('.card').first().locator('.card-handle');
  const targetList = page.locator('.column').nth(1).locator('.card-list');

  const sourceBox = await sourceHandle.boundingBox();
  const targetBox = await targetList.boundingBox();
  if (!sourceBox || !targetBox) {
    throw new Error('Unable to resolve drag source or target bounds');
  }

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 12 });
  await page.mouse.up();

  await expect(page.locator('.column').nth(1).locator('.card')).toHaveCount(2);

  const addForm = page.locator('.column').nth(0);
  await addForm.locator('input[placeholder="Card title"]').fill('New task');
  await addForm.locator('textarea[placeholder="Card details"]').fill('Confirm details render on board.');
  await addForm.locator('button:has-text("Add card")').click();
  await expect(page.locator('text=New task')).toBeVisible({ timeout: 10000 });

  const deleteButton = addForm.locator('.delete-button').last();
  await deleteButton.click();
  await expect(page.locator('text=New task')).toHaveCount(0, { timeout: 5000 });
});
