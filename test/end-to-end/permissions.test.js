import { logInAs, signOutToHomepage } from './e2e-helper';

describe('Checking each user permissions to access pages', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  afterEach(async () => {
    await signOutToHomepage();
  });

  it('Logs in as clincian and cannot access manage or admin pages', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });

    await page.goto(process.env.BASE_URL + '/manage');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });

    await page.goto(process.env.BASE_URL + '/admin');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });
  });

  it('Logs in as department and cannot access admin page', async () => {
    await logInAs({
      username: 'department@example.com',
      password: 'department',
    });

    await page.goto(process.env.BASE_URL + '/admin');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });
  });

  it('Logs in as hospital and cannot access self-reporting or admin pages', async () => {
    await logInAs({
      username: 'hospital@example.com',
      password: 'hospital',
    });

    await page.goto(process.env.BASE_URL + '/self-reporting');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });

    await page.goto(process.env.BASE_URL + '/admin');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });
  });

  it('Logs in as health board and cannot access self-reporting or manage or admin pages', async () => {
    await logInAs({
      username: 'healthboard@example.com',
      password: 'healthboard',
    });

    await page.goto(process.env.BASE_URL + '/self-reporting');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });

    await page.goto(process.env.BASE_URL + '/manage');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });

    await page.goto(process.env.BASE_URL + '/admin');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });
  });
});
