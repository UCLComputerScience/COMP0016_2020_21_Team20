import prisma from '../../lib/prisma';
import { logInAs, signOutToHomepage } from './e2e-helper';

describe('Logging in', () => {
  beforeEach(async () => await page.goto(process.env.BASE_URL));

  afterEach(async () => {
    await signOutToHomepage();
    await prisma.$disconnect();
  });

  it('Login as clinician', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'self-reporting' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Login as department', async () => {
    await logInAs({
      username: 'department@example.com',
      password: 'department',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'self-reporting' });
    await expect(page).toMatchElement('a', { text: 'manage' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Login as hospital', async () => {
    await logInAs({
      username: 'hospital@example.com',
      password: 'hospital',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'manage' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Login as health board', async () => {
    await logInAs({
      username: 'healthboard@example.com',
      password: 'healthboard',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Login as admin', async () => {
    await logInAs({
      username: 'admin@example.com',
      password: 'admin',
    });
    await expect(page).toMatchElement('a', { text: 'admin' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });
});
