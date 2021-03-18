import { logInAs } from './e2e-helper';

describe('Managing join codes', () => {
  beforeAll(async () => {
    await page.goto(process.env.BASE_URL);

    // Puppeteer Firefox doesn't support overriding permissions yet
    if (!process.env.TEST_FIREFOX) {
      const context = await browser.defaultBrowserContext();
      await context.overridePermissions(process.env.BASE_URL, [
        'clipboard-write',
        'clipboard-read',
      ]);
    }
  });

  it('Logs in and goes to manage tab', async () => {
    await logInAs({
      username: 'hospital@example.com',
      password: 'hospital',
    });
    await expect(page).toClick('#manage');
    await page.waitForTimeout(100);
    await expect(page).toMatchElement('h3', {
      text: 'Manage and add new departments',
    });
  });

  it('Copies join URL', async () => {
    await expect(page).toClick('#copy0');
    await expect(page).toMatchElement('div', {
      text: 'Copied',
    });

    if (!process.env.TEST_FIREFOX) {
      const copiedText = await page.evaluate(
        `(async () => await navigator.clipboard.readText())()`
      );
      expect(copiedText).toMatch('/join/department_manager');
    }
  });

  it('Regenerates URL', async () => {
    let before;
    if (!process.env.TEST_FIREFOX) {
      await expect(page).toClick('#copy0');
      before = await page.evaluate(
        `(async () => await navigator.clipboard.readText())()`
      );
    }

    await page.evaluate(() => document.querySelector('#regenerate0').click());

    await expect(page).toMatchElement('div', {
      text: 'Join URL updated',
    });
    await expect(page).toClick('#copy0');

    if (!process.env.TEST_FIREFOX) {
      const after = await page.evaluate(
        `(async () => await navigator.clipboard.readText())()`
      );

      expect(after).not.toEqual(before);
    }
  });
});
