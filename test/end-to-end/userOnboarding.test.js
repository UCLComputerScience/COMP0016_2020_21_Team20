import { logInAs } from './e2e-helper';

const testEmail = 'test@example.com';
const testPassword = 'test';
describe('Logging in', () => {
  beforeEach(async () => await page.goto(process.env.BASE_URL));

  it('Registers as test user', async () => {
    await expect(page).toClick('a', { text: 'Log in' });
    await page.waitForSelector('#kc-form-login');
    await expect(page).toClick('a', { text: 'Register' });
    await page.waitForSelector('#kc-register-form');
    await expect(page).toFillForm('#kc-register-form', {
      email: testEmail,
      password: testPassword,
      'password-confirm': testPassword,
    });
    await expect(page).toClick(
      'input.pf-c-button.pf-m-primary.pf-m-block.btn-lg'
    );
    await page.waitForTimeout(500);
    await expect(page).toClick('a', { text: 'Your account' });
  });

  it('Uses join code', async () => {
    await page.goto(
      process.env.BASE_URL + '/join/department_manager/bbb-bbb-bbb'
    );
    await expect(page).toMatchElement('#joinSuccess');
    await expect(page).toClick('#goToHomepage');
    await page.waitForTimeout(500);
  });

  it('Verfies now a department user', async () => {
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'self-reporting' });
    await expect(page).toMatchElement('a', { text: 'manage' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Goes to account settings', async () => {
    await expect(page).toClick('a', { text: 'Your account' });
    await expect(page).toClick('a', { text: 'Account settings' });
    await page.waitForTimeout(1000);
    let pages = await browser.pages();
    const accountPage = pages.find(
      p => !p.url().includes(process.env.BASE_URL)
    );
    expect(
      await accountPage.evaluate(() => {
        return (
          document.body.contains(
            document.getElementById('landingWelcomeMessage')
          ) &&
          document.body.contains(
            document.getElementById('landing-personal-info')
          ) &&
          document.body.contains(document.getElementById('landing-security'))
        );
      })
    ).toBe(true);
    await accountPage.close();
  });

  it('Leaves department', async () => {
    await expect(page).toClick('a', { text: 'Your account' });
    await expect(page).toClick('a', { text: 'Leave Department' });
    await page.evaluate(() => document.querySelector('#leave').click());
    await page.waitForSelector('#loginOrRegister', { visible: true });
  });

  it('Logs in and checks no longer department manager', async () => {
    await logInAs({
      username: testEmail,
      password: testPassword,
    });
    await expect(page).not.toMatchElement('a', { text: 'statistics' });
    await expect(page).not.toMatchElement('a', { text: 'self-reporting' });
    await expect(page).not.toMatchElement('a', { text: 'manage' });
  });
});
