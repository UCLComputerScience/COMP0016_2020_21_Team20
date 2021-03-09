import prisma from '../../lib/prisma';
import { logInAs, signOutToHomepage } from './e2e-helper';

describe('Logging in', () => {
  beforeEach(async () => await page.goto(process.env.BASE_URL));

  afterEach(async () => {
    await signOutToHomepage();
    await prisma.$disconnect();
  });

  it('Logs in as clinician', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'self-reporting' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Logs in as department', async () => {
    await logInAs({
      username: 'department@example.com',
      password: 'department',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'self-reporting' });
    await expect(page).toMatchElement('a', { text: 'manage' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Logs in as hospital', async () => {
    await logInAs({
      username: 'hospital@example.com',
      password: 'hospital',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'manage' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Logs in as health board', async () => {
    await logInAs({
      username: 'healthboard@example.com',
      password: 'healthboard',
    });
    await expect(page).toMatchElement('a', { text: 'statistics' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });

  it('Logs in as admin', async () => {
    await logInAs({
      username: 'admin@example.com',
      password: 'admin',
    });
    await expect(page).toMatchElement('a', { text: 'admin' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });
});
