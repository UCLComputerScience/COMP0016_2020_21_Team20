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

  it('Adds new health board', async () => {
    await expect(page).toClick('#addNewHealthBoard');

    await expect(page).toFill(
      '#newEntityForm input[name="name"]',
      'Test UI Health Board'
    );
    await expect(page).toClick('#submitNewEntity');

    // Ensure success dialog showed
    await expect(page).toMatchElement('div', {
      text: 'Health board successfully added',
    });

    await page.waitForTimeout(1000);
  });

  it('Adds new hospital', async () => {
    await expect(page).toClick('#addNewHospital');

    await expect(page).toFill(
      '#newEntityForm input[name="name"]',
      'Test UI Hospital'
    );

    // Select "health board" dropdown and the newly created health board
    await expect(page).toClick('#newEntityForm a[name="id"]');
    await page.waitForTimeout(2000);
    await expect(page).toClick('.rs-picker-menu a', {
      text: 'Test UI Health Board',
    });

    await expect(page).toClick('#submitNewEntity');

    // Ensure success dialog showed
    await expect(page).toMatchElement('div', {
      text: 'Hospital successfully added',
    });
  });
});
