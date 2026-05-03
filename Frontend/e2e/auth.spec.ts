import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/');
    // Trình duyệt sẽ tự động redirect tới /login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    // Bấm nút đăng nhập ngay
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    // Báo lỗi do validation
    await expect(page.getByText('Vui lòng nhập tên tài khoản')).toBeVisible();
  });
});
