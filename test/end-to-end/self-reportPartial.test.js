import { logInAs } from './e2e-helper';

const numOfQs = 7;
describe('Partially filling in self report', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Fills form partially', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toClick('a', { text: 'self-report' });
    await page.waitForNavigation();

    //wait for questions to load
    await page.waitForSelector('#q1a1', { visible: true });

    //answer all questions excpet last
    for (var i = 1; i < numOfQs; i++) {
      await expect(page).toClick('#q' + i.toString() + 'a2');
    }

    //await expect(page).toClick('#submit');
    //await page.evaluate(() => document.querySelector('#incomplete'));
  });
});
