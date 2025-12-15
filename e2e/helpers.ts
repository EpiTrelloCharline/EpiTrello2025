import { Page } from '@playwright/test';

/**
 * Helpers and utilities for E2E tests
 */

/**
 * Waits for an element to be visible with a retry
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Waits for an API request to complete
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(response => {
    const url = response.url();
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  });
}

/**
 * Takes a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = Date.now();
  await page.screenshot({ 
    path: `playwright-report/screenshots/${name}-${timestamp}.png`, 
    fullPage: true 
  });
}

/**
 * Clears localStorage and sessionStorage
 */
export async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Retrieves the authentication token from localStorage
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return page.evaluate(() => localStorage.getItem('accessToken'));
}

/**
 * Sets the authentication token in localStorage
 */
export async function setAuthToken(page: Page, token: string) {
  await page.evaluate((t) => localStorage.setItem('accessToken', t), token);
}

/**
 * Waits for the network to be idle
 */
export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Fills a form based on an object
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [name, value] of Object.entries(formData)) {
    const input = page.locator(`input[name="${name}"], textarea[name="${name}"]`);
    if (await input.isVisible()) {
      await input.fill(value);
    }
  }
}

/**
 * Waits for a toast/notification to appear
 */
export async function waitForToast(page: Page, message?: string) {
  const toastSelector = message 
    ? `[role="alert"]:has-text("${message}"), .toast:has-text("${message}")`
    : '[role="alert"], .toast';
  
  await page.waitForSelector(toastSelector, { state: 'visible', timeout: 5000 });
}

/**
 * Simulates an HTML5 drag and drop
 */
export async function dragAndDropHTML5(
  page: Page, 
  sourceSelector: string, 
  targetSelector: string
) {
  await page.evaluate(({ source, target }) => {
    const sourceElement = document.querySelector(source);
    const targetElement = document.querySelector(target);
    
    if (!sourceElement || !targetElement) {
      throw new Error('Source or target element not found');
    }

    const dataTransfer = new DataTransfer();
    
    // Dispatch dragstart
    const dragStartEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer
    });
    sourceElement.dispatchEvent(dragStartEvent);
    
    // Dispatch dragover
    const dragOverEvent = new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      dataTransfer
    });
    targetElement.dispatchEvent(dragOverEvent);
    
    // Dispatch drop
    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer
    });
    targetElement.dispatchEvent(dropEvent);
    
    // Dispatch dragend
    const dragEndEvent = new DragEvent('dragend', {
      bubbles: true,
      cancelable: true,
      dataTransfer
    });
    sourceElement.dispatchEvent(dragEndEvent);
  }, { source: sourceSelector, target: targetSelector });
  
  await page.waitForTimeout(500);
}

/**
 * Retries a function until it succeeds or times out
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError || new Error('Max retries reached');
}

/**
 * Generates random test data
 */
export const generateTestData = {
  email: () => `test-${Date.now()}@example.com`,
  password: () => 'TestPassword123!',
  name: () => `Test User ${Date.now()}`,
  workspaceName: () => `Test Workspace ${Date.now()}`,
  boardName: () => `Test Board ${Date.now()}`,
  listName: () => `Test List ${Date.now()}`,
  cardTitle: () => `Test Card ${Date.now()}`,
};

/**
 * Verifies that the elements in a list are in the expected order
 */
export async function verifyElementsOrder(
  page: Page,
  containerSelector: string,
  expectedTexts: string[]
) {
  const elements = await page.locator(containerSelector).allTextContents();
  return expectedTexts.every((text, index) => elements[index]?.includes(text));
}
