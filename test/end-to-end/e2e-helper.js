export async function logInAs(props) {
  await expect(page).toClick('a', { text: 'Log in' });
  await page.waitForSelector('#kc-form-login');
  await expect(page).toFillForm('#kc-form-login', {
    username: props.username,
    password: props.password,
  });
  await expect(page).toClick('input#kc-login');
  await page.waitForTimeout(1000);
}

export async function signOutToHomepage() {
  await expect(page).toClick('a', { text: 'Your account' });
  await expect(page).toClick('a', { text: 'Sign out' });
  await page.waitForSelector('#logIn');
}

const { likertScaleQuestions } = require('../../seedData');

export const numberOfQuestions = likertScaleQuestions.length;
