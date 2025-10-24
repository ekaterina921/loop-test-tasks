import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProjectPage } from '../pages/ProjectPage';
import testData from '../test-data/test-cases.json';

// Group all test cases under a describe block
test.describe('Data-Driven Task Verification Tests', () => {
  let loginPage: LoginPage;
  let projectPage: ProjectPage;

  // Run before each test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    projectPage = new ProjectPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login(testData.loginCredentials.email, testData.loginCredentials.password);
  });

  // Data-driven tests: iterate through each test case
  for (const testCase of testData.testCases) {
    test(`${testCase.id}: ${testCase.description}`, async ({ page }) => {
      // Navigate to the project
      await projectPage.navigateToProject(testCase.project);
      
      // Verify task is in the correct column
      await test.step(`Verify "${testCase.taskName}" is in "${testCase.expectedColumn}" column`, async () => {
        await projectPage.verifyTaskInColumn(testCase.taskName, testCase.expectedColumn);
      });
      
      // Verify task has correct tags
      await test.step(`Verify "${testCase.taskName}" has tags: ${testCase.expectedTags.join(', ')}`, async () => {
        await projectPage.verifyTaskTags(testCase.taskName, testCase.expectedTags);
      });
    });
  }
});