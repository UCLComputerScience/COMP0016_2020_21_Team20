import { logInAs } from './e2e-helper';

describe('Manage entities', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Logs in and goes to manage tab', async () => {
    await logInAs({
      username: 'admin@example.com',
      password: 'admin',
    });
    await expect(page).toClick('#manage');
  });

  it('Adds new health board user', async () => {
    await page.waitForTimeout(1000);
    await expect(page).toClick('#addNewHealthBoardUser');
    await expect(page).toFill(
      '#newUserForm input[name="email"]',
      'testhealthboard@example.com'
    );

    // Select "health board" dropdown and an existing health board
    await expect(page).toClick('#newUserForm a[name="id"]');
    await page.waitForTimeout(2000);
    await expect(page).toClick('.rs-picker-menu a', {
      text: 'Test Health Board',
    });

    await expect(page).toClick('#newUserForm #generatePassword');

    // Ensure password is generated corretly
    const generatedPassword = await page.evaluate(
      () => document.querySelector('#newUserForm input[name="password"]').value
    );
    expect(generatedPassword.length).toEqual(15);

    await expect(page).toClick('#submitNewUser');

    // Ensure success dialog showed
    await expect(page).toMatchElement('div', {
      text: /User successfully added.*?/,
    });
  });

  it('Adds new hospital user', async () => {
    await page.waitForTimeout(1000);
    await expect(page).toClick('#addNewHospitalUser');
    await expect(page).toFill(
      '#newUserForm input[name="email"]',
      'testhospital@example.com'
    );

    // Select "hospital" dropdown and an existing hospital
    await expect(page).toClick('#newUserForm a[name="id"]');
    await page.waitForTimeout(2000);
    await expect(page).toClick('.rs-picker-menu a', {
      text: 'Test Hospital',
    });

    await expect(page).toClick('#newUserForm #generatePassword');

    // Ensure password is generated corretly
    const generatedPassword = await page.evaluate(
      () => document.querySelector('#newUserForm input[name="password"]').value
    );
    expect(generatedPassword.length).toEqual(15);

    await expect(page).toClick('#submitNewUser');

    // Ensure success dialog showed
    await expect(page).toMatchElement('div', {
      text: /User successfully added.*?/,
    });
  });

  it('Adds new admin user', async () => {
    await page.waitForTimeout(1000);
    await expect(page).toClick('#addNewAdminUser');
    await expect(page).toFill(
      '#newUserForm input[name="email"]',
      'testadmin@example.com'
    );
    await expect(page).toClick('#newUserForm #generatePassword');

    // Ensure password is generated corretly
    const generatedPassword = await page.evaluate(
      () => document.querySelector('#newUserForm input[name="password"]').value
    );
    expect(generatedPassword.length).toEqual(15);

    await expect(page).toClick('#submitNewUser');

    // Ensure success dialog showed
    await expect(page).toMatchElement('div', {
      text: /User successfully added.*?/,
    });
  });
});
