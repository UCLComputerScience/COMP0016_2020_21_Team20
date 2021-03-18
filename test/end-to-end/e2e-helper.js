export async function logInAs(props) {
  await expect(page).toClick('a', { text: 'Log in' });
  await page.waitForNavigation();
  await expect(page).toFillForm('#kc-form-login', {
    username: props.username,
    password: props.password,
  });
  await expect(page).toClick('input#kc-login');
  await page.waitForNavigation();
}

export async function signOutToHomepage() {
  await expect(page).toClick('a', { text: 'Your account' });
  await expect(page).toClick('a', { text: 'Sign out' });
  await page.waitForNavigation();
}

const { likertScaleQuestions } = require('../../seedData');

export const numberOfQuestions = likertScaleQuestions.length;
