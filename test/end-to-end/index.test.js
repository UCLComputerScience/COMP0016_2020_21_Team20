describe('Home page', () => {
  beforeEach(async () => await page.goto(process.env.BASE_URL));

  it('Shows the login buttons', async () => {
    await expect(page).toMatchElement('a', { text: 'Log in' });
    await expect(page).toMatchElement('button', { text: 'Login or Register' });
  });

  it('Shows the help button', async () => {
    await expect(page).toMatchElement('a', { text: 'help' });
  });

  it('Clicks the login button', async () => {
    await expect(page).toClick('a', { text: 'Log in' });
    await page.waitForNavigation();
    await expect(page).toFillForm('#kc-form-login', {
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toClick('input#kc-login');
    await page.waitForNavigation();
    await page.screenshot({ path: 'DEBUG_DELETE_ME .png' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });
});
