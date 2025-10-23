import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import testData from '../test-data/test-cases.json';

test.describe('Login Tests', () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(testData.loginCredentials.email, testData.loginCredentials.password);
    
    // Verify successful login by checking URL or page content
    await expect(page).not.toHaveURL(/.*login.*/);
  });
});