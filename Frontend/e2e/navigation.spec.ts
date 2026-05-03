import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  // Test này chỉ có thể pass khi auth state có sẵn hoặc mock login
  test.skip('should navigate from dashboard to employees', async ({ page }) => {
    // 1. Mock login state bằng cách set localStorage/cookies (tuỳ theo app implementation)
    // 2. Chuyển tới trang dashboard
    await page.goto('/workspace');
    
    // 3. Click menu Nhân viên
    const employeeLink = page.getByRole('link', { name: /nhân viên/i });
    await employeeLink.click();
    
    // 4. Kiểm tra URL đã thay đổi
    await expect(page).toHaveURL(/.*employees/);
  });
});
