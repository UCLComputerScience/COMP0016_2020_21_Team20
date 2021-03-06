import { logInAs } from './e2e-helper';

describe('Managing departments', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Logs in and goes to manage tab', async () => {
    await logInAs({
      username: 'hospital@example.com',
      password: 'hospital',
    });
    await expect(page).toClick('#manage');
    await page.waitForNavigation();
  });

  it('Adds department', async () => {
    await expect(page).toClick('#addNewDept');

    await expect(page).toFill('#newDeptName', 'testDept');
    await expect(page).toClick('#addDept');

    //check if new department in the table
    await expect(page).toMatchElement('td', { text: 'testDept' });
  });

  it('Deletes department', async () => {
    //delete 3rd (index starts at 0) as there are already 2 other departments in test environment
    await page.evaluate(() => document.querySelector('#delete2').click());

    await page.waitForSelector('#confirmDelete', { visible: true });
    await expect(page).toClick('#confirmDelete');

    await expect(page).toMatchElement('div', {
      text: 'Department successfully deleted',
    });
  });
});
