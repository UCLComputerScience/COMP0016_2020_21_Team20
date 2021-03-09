import { logInAs, numberOfQuestions } from './e2e-helper';

describe('Partially filling in self report', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Logs in and goes to self report tab', async () => {
    expect.hasAssertions();
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toClick('#self-reporting');
    await page.waitForNavigation();
  });

  it('Fills form partially', async () => {
    //wait for questions to load
    await page.waitForSelector('#q1a1', { visible: true });

    //answer all questions excpet last
    for (var i = 1; i < numberOfQuestions; i++) {
      await expect(page).toClick('#q' + i.toString() + 'a2');
    }
  });

  it('Submits and shows incomplete message', async () => {
    await expect(page).toClick('#submit');
    await page.evaluate(() => document.querySelector('#incomplete'));
  });
});
