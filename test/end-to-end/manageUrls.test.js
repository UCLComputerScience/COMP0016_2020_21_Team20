import { logInAs } from './e2e-helper';

describe('Managing Urls', () => {
  const testUrl = 'https://example.com/';
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Logs in and goes to manage tab', async () => {
    await logInAs({
      username: 'department@example.com',
      password: 'department',
    });
    await expect(page).toClick('#manage');
    await page.waitForNavigation();
  });

  it('Edits to test URL', async () => {
    await page.waitForSelector('#edit0', { visible: true });
    await page.evaluate(() => document.querySelector('#edit0').click());

    await expect(page).toFill('input[id="url0"]', testUrl);
    await expect(page).toClick('#saveEdit0');

    await expect(page).toMatchElement('a', { text: testUrl });
  });

  it('Goes to self-report tab to check test url is there', async () => {
    await expect(page).toClick('#self-reporting');
    await page.waitForNavigation();

    const links = await page.$$eval('a', el =>
      el.map(x => x.getAttribute('href'))
    );

    expect(links.includes(testUrl)).toBe(true);
  });

  it('Goes to manage tab and sets a Url to default', async () => {
    await expect(page).toClick('#manage');
    await page.waitForNavigation();

    await page.waitForSelector('#setDefault0', { visible: true });
    await page.evaluate(() => document.querySelector('#setDefault0').click());

    await expect(page).toMatchElement('div', {
      text: 'URL set to default suggested URL',
    });
  });
});
