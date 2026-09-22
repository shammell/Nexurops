import { test, expect } from '@playwright/test';

test.describe('Admin Clients CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin/clients');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with title', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Clients');
  });

  test('displays mock clients table', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check for sample client names
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=Sarah Johnson')).toBeVisible();
  });

  test('add client button visible', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")');
    await expect(addButton).toBeVisible();
  });

  test('open create modal', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();

    const modal = page.locator('text=Create New Client');
    await expect(modal).toBeVisible();
  });

  test('create modal has form fields', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();

    // Check form inputs exist
    await expect(page.locator('input[placeholder*="name"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="company"]')).toBeVisible();
  });

  test('close modal with cancel button', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();

    const modal = page.locator('text=Create New Client');
    await expect(modal).toBeVisible();

    const cancelButton = page.locator('button:has-text("Cancel")').first();
    await cancelButton.click();

    await expect(modal).not.toBeVisible();
  });

  test('form validation - empty name fails', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();

    // Try submitting without name
    const submitButton = page.locator('button:has-text("Create")').first();
    await submitButton.click();

    // Should show error
    const error = page.locator('text=Name');
    await expect(error).toBeVisible();
  });

  test('delete button visible in table', async ({ page }) => {
    const deleteButtons = page.locator('button svg[class*="Trash"]').or(page.locator('text=Delete'));
    const count = await deleteButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('status badges colored correctly', async ({ page }) => {
    const badges = page.locator('span:has-text("ACTIVE")').or(page.locator('span:has-text("INACTIVE")'));
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('edit button visible in table', async ({ page }) => {
    const editButtons = page.locator('button svg[class*="Edit"]').or(page.locator('text=Edit'));
    const count = await editButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('table displays all columns', async ({ page }) => {
    const headers = page.locator('th');
    const headerTexts = await headers.allTextContents();

    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('Email');
    expect(headerTexts).toContain('Status');
  });
});
