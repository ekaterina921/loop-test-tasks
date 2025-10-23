import { Page, Locator, expect } from '@playwright/test';

export class ProjectPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToProject(projectName: string) {
    // Look for project link or button
    const projectLink = this.page.locator(`a:has-text("${projectName}"), button:has-text("${projectName}"), [role="link"]:has-text("${projectName}")`).first();
    await projectLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTaskColumn(taskName: string): Promise<string> {
    // Find the task card
    const taskCard = this.page.locator(`[class*="task"], [class*="card"]`).filter({ hasText: taskName }).first();
    await expect(taskCard).toBeVisible({ timeout: 10000 });
    
    // Find the parent column
    const column = taskCard.locator('xpath=ancestor::*[contains(@class, "column") or contains(@class, "lane")]').first();
    
    // Get column header text
    const columnHeader = column.locator('[class*="header"], h2, h3').first();
    const columnName = await columnHeader.textContent();
    
    return columnName?.trim() || '';
  }

  async getTaskTags(taskName: string): Promise<string[]> {
    // Find the task card
    const taskCard = this.page.locator(`[class*="task"], [class*="card"]`).filter({ hasText: taskName }).first();
    await expect(taskCard).toBeVisible({ timeout: 10000 });
    
    // Find all tags within the task card
    const tags = taskCard.locator('[class*="tag"], [class*="badge"], [class*="label"]');
    const tagCount = await tags.count();
    
    const tagTexts: string[] = [];
    for (let i = 0; i < tagCount; i++) {
      const tagText = await tags.nth(i).textContent();
      if (tagText) {
        tagTexts.push(tagText.trim());
      }
    }
    
    return tagTexts;
  }

  async verifyTaskInColumn(taskName: string, expectedColumn: string) {
    const actualColumn = await this.getTaskColumn(taskName);
    expect(actualColumn.toLowerCase()).toContain(expectedColumn.toLowerCase());
  }

  async verifyTaskTags(taskName: string, expectedTags: string[]) {
    const actualTags = await this.getTaskTags(taskName);
    
    // Verify all expected tags are present
    for (const expectedTag of expectedTags) {
      const tagFound = actualTags.some(tag => 
        tag.toLowerCase().includes(expectedTag.toLowerCase())
      );
      expect(tagFound, `Expected tag "${expectedTag}" not found. Actual tags: ${actualTags.join(', ')}`).toBeTruthy();
    }
    
    // Verify tag count matches
    expect(actualTags.length, `Expected ${expectedTags.length} tags but found ${actualTags.length}`).toBe(expectedTags.length);
  }
}
