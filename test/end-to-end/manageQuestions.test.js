import { logInAs, signOutToHomepage, numberOfQuestions } from './e2e-helper';

describe('Managing questions', () => {
  const testQuestion = 'test question';
  const newTestQuestion = 'new test question';
  const testUrl = 'https://example.com/';
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Logs in and goes to admin tab', async () => {
    await logInAs({
      username: 'admin@example.com',
      password: 'admin',
    });
    await expect(page).toClick('#admin');
    await page.waitForNavigation();
  });

  it('Edits question to test question', async () => {
    await page.waitForSelector('#edit0', { visible: true });
    await page.evaluate(() => document.querySelector('#edit0').click());

    await expect(page).toFill('input[id="questionInput0"]', testQuestion);
    await expect(page).toClick('#saveEdit0');

    await expect(page).toMatchElement('div', { text: testQuestion });
  });

  it('Adds new test question', async () => {
    await page.waitForSelector('#addNewQuestion', { visible: true });
    await expect(page).toClick('#addNewQuestion');

    await page.waitForSelector('#bodyText', { visible: true });
    await expect(page).toFill('#bodyText', newTestQuestion);
    await expect(page).toClick('#chooseStandard');
    await expect(page).toClick('#standard1');
    await expect(page).toFill('#urlText', testUrl);
    await expect(page).toClick('#addQuestion');

    await new Promise(r => setTimeout(r, 500));

    await expect(page).toMatchElement('div', { text: newTestQuestion });
    await signOutToHomepage();
  });

  it('Logs in and goes to self-reporting tab', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toClick('#self-reporting');
    await page.waitForNavigation();
  });

  it('Checks test question body is there', async () => {
    //wait for questions to load
    await page.waitForSelector('#q1', { visible: true });

    var found, question;
    for (var i = 1; i <= numberOfQuestions; i++) {
      question = await page.$eval('#q' + i.toString(), el => el.textContent);
      if (question.includes(testQuestion)) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('Checks new test question is there', async () => {
    var found, question;
    for (var i = 1; i <= numberOfQuestions + 1; i++) {
      question = await page.$eval('#q' + i.toString(), el => el.textContent);
      if (question.includes(newTestQuestion)) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});
