import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the login page
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly toggleModeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.nameInput = page.locator('input[type="text"]');
    this.submitButton = page.getByRole('button', { name: /connexion|s'inscrire|login|sign/i });
    this.toggleModeButton = page.getByRole('button', { name: /inscription|connexion/i });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async register(email: string, password: string, name: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

/**
 * Page Object Model for the workspaces page
 */
export class WorkspacesPage {
  readonly page: Page;
  readonly createWorkspaceButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createWorkspaceButton = page.getByRole('button', { name: /créer un espace de travail/i });
  }

  async goto() {
    await this.page.goto('/workspaces');
  }

  async createWorkspace(name: string) {
    // Click the button to display the form
    await this.createWorkspaceButton.click();
    await this.page.waitForTimeout(500);
    
    // Fill the form
    await this.page.locator('input[type="text"]').first().fill(name);
    
    // Submit the form (Create button)
    await this.page.locator('button[type="submit"]').click();
    await this.page.waitForTimeout(2000);
  }
}

/**
 * Page Object Model for a board
 */
export class BoardPage {
  readonly page: Page;
  readonly addListButton: Locator;
  readonly boardTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addListButton = page.getByRole('button', { name: /ajouter.*liste|add.*list/i });
    this.boardTitle = page.locator('h1, h2').first();
  }

  async createList(name: string) {
    await this.addListButton.click();
    await this.page.fill('input[name="title"], input[name="name"], input[placeholder*="liste" i]', name);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async addCardToList(listName: string, cardTitle: string) {
    const list = this.page.locator(`div:has-text("${listName}")`).first();
    await list.getByRole('button', { name: /ajouter.*carte|add.*card/i }).click();
    await this.page.fill('textarea[name="title"], input[name="title"]', cardTitle);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async dragCardToList(cardTitle: string, targetListName: string) {
    const card = this.page.locator(`text=${cardTitle}`).first();
    const targetList = this.page.locator(`div:has-text("${targetListName}")`).first();
    
    const cardBox = await card.boundingBox();
    const targetBox = await targetList.boundingBox();
    
    if (cardBox && targetBox) {
      await this.page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await this.page.mouse.down();
      await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
      await this.page.waitForTimeout(500);
      await this.page.mouse.up();
      await this.page.waitForTimeout(2000);
    }
  }

  async openCard(cardTitle: string) {
    await this.page.locator(`text=${cardTitle}`).first().click();
    await this.page.waitForTimeout(1000);
  }

  async updateCardTitle(newTitle: string) {
    const titleInput = this.page.locator('input[value*="Tâche"], textarea, input[name="title"]').first();
    await titleInput.clear();
    await titleInput.fill(newTitle);
  }

  async updateCardDescription(description: string) {
    const descriptionField = this.page.locator('textarea[name="description"], textarea[placeholder*="description" i]').first();
    await descriptionField.fill(description);
  }

  async closeCardModal() {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }
}
