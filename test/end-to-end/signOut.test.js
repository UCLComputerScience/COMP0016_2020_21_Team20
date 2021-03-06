import { logInAs, signOutToHomepage } from './e2e-helper';

describe('Signing out', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Logs in as clincian', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
  });

  it('Signs out', async () => {
    await signOutToHomepage();
  });

  it('Cannot access statistics page ', async () => {
    await page.goto(process.env.BASE_URL + '/statistics');
    await expect(page).toMatchElement('p', {
      text: 'You must login or register to use the Care Quality Dashboard.',
    });
  });

  it('Cannot access self-reporting page ', async () => {
    await page.goto(process.env.BASE_URL + '/self-reporting');
    await expect(page).toMatchElement('p', {
      text: 'You must login or register to use the Care Quality Dashboard.',
    });
  });

  it('Cannot access manage page ', async () => {
    await page.goto(process.env.BASE_URL + '/manage');
    await expect(page).toMatchElement('p', {
      text: 'You must login or register to use the Care Quality Dashboard.',
    });
  });

  it('Cannot access admin page ', async () => {
    await page.goto(process.env.BASE_URL + '/admin');
    await expect(page).toMatchElement('p', {
      text: 'You must login or register to use the Care Quality Dashboard.',
    });
  });
});
