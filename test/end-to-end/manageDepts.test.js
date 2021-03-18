import { logInAs } from './e2e-helper';

describe('Managing departments', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

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

  it('Adds department', async () => {
    await expect(page).toClick('#addNewDept');

    await expect(page).toFill('#newDeptName', 'testDept');
    await expect(page).toClick('#addDept');

    //check if new department in the table
    await expect(page).toMatchElement('td', { text: 'testDept' });
  });

  it('Deletes department', async () => {
    await page.waitForTimeout(1000);

    // Override the window.confirm function to always return true, to confirm the dialog in next step
    await page.evaluate(() => {
      window.confirm = function () {
        return true;
      };
    });

    // Delete 3rd (index starts at 0) as there are already 2 other departments in test environment
    await expect(page).toClick('#delete2');
    await expect(page).toMatchElement('div', {
      text: 'Department successfully deleted',
    });
  });
});
