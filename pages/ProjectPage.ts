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
  
  async getTaskCard(taskName: string){
    const taskCard = this.page.getByRole('heading', { level: 3, name: taskName});
    await expect(taskCard).toBeVisible({ timeout: 1000});
    return taskCard;
  }
  async getTaskColumn(taskCard: Locator): Promise<string> {  
    // Find the parent column
    const column = taskCard.locator('xpath=parent::div/parent::div/preceding-sibling::h2').first();
    
    // Get column header text
    const columnName = await column.textContent();
    
    return columnName?.trim() || '';
  }

  async getTaskTags(taskCard: Locator): Promise<string[]> { 
    // Find all tags within the task card
    const tags = taskCard.locator('xpath=parent::div/div/span');
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

  async verifyTaskInColumn(taskCard: Locator, expectedColumn: string) {
    const actualColumn = await this.getTaskColumn(taskCard);
    expect(actualColumn.toLowerCase()).toContain(expectedColumn.toLowerCase());
  }

  async verifyTaskTags(taskCard: Locator, expectedTags: string[]) {
    const actualTags = await this.getTaskTags(taskCard);
    
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
