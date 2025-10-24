import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole("button", {name : "Sign in"});
  }

  async goto() {
    await this.page.goto('/');
  }

  async login() {
    if(typeof process.env.TEST_USERNAME === "string" 
      && typeof process.env.TEST_PASSWORD === "string")
    {
    await this.userNameInput.fill(process.env.TEST_USERNAME);
    await this.passwordInput.fill(process.env.TEST_PASSWORD);
    } else {
      throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in .env file.');
    }
    await this.loginButton.click();
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
  }
}