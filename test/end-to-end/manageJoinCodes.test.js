import { logInAs } from './e2e-helper';

describe('Logging in', () => {
  beforeAll(async () => {
    await page.goto(process.env.BASE_URL);
    const context = await browser.defaultBrowserContext();
    await context.overridePermissions(process.env.BASE_URL, [
      'clipboard-write',
      'clipboard-read',
    ]);
  });

  it('Logs in and goes to manage tab', async () => {
    await logInAs({
      username: 'hospital@example.com',
      password: 'hospital',
    });
    await expect(page).toClick('#manage');
    await page.waitForNavigation();
  });

  it('Copies join URL', async () => {
    await expect(page).toClick('#copy0');
    const copiedText = await page.evaluate(
      `(async () => await navigator.clipboard.readText())()`
    );

    await expect(page).toMatchElement('div', {
      text: 'Copied',
    });
    expect(copiedText.includes('/join/department_manager/')).toBe(true);
  });

  it('Regenerates URL', async () => {
    await expect(page).toClick('#copy0');
    const before = await page.evaluate(
      `(async () => await navigator.clipboard.readText())()`
    );

    await page.evaluate(() => document.querySelector('#regenerate0').click());

    await expect(page).toMatchElement('div', {
      text: 'Join URL updated',
    });
    await expect(page).toClick('#copy0');
    const after = await page.evaluate(
      `(async () => await navigator.clipboard.readText())()`
    );

    expect(after !== before).toBe(true);
  });
});
