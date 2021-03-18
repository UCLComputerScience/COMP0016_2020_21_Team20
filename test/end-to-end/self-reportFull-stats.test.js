import { logInAs, numberOfQuestions } from './e2e-helper';

describe('Fully filling in self report', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  it('Logs in and goes to self report tab', async () => {
    expect.hasAssertions();
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toClick('#self-reporting');
    await page.waitForSelector('#submit');
  });

  it('Fills and submits form', async () => {
    //wait for questions to load
    await page.waitForSelector('#q1a1', { visible: true });

    //answer all questions as neutral
    for (var i = 1; i <= numberOfQuestions; i++) {
      await expect(page).toClick('#q' + i.toString() + 'a2');
    }

    //answer all enabler inputs as test
    var id;
    for (var i = 0; i < 3; i++) {
      id = 'wq' + (numberOfQuestions + 1).toString() + 'i' + i.toString();
      await expect(page).toFill('input[id="' + id + '"]', 'test');
    }

    await expect(page).toClick('#submit');
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      document.getElementById('confirm').click();
    });
  });

  it('Displays response in circles', async () => {
    // Confusing FF Puppeteer bug causes selectors to stop working when trying to
    // waitForSelector/waitForTimeout/anything really so need this
    await page.goto(process.env.BASE_URL + '/statistics');
    await expect(page).toMatchElement('text', { text: 'Quick Summary' });
    await expect(page).toClick('#summary');

    //wait for circles to load
    await page.waitForSelector("[id='c0%50']", { visible: true });

    for (var i = 0; i < numberOfQuestions; i++) {
      await expect(page).toMatchElement("[id='c" + i.toString() + "%50']");
    }

    await expect(page).toClick('#summary');
  });

  it('Displays response in analytics', async () => {
    // Confusing FF Puppeteer bug causes selectors to stop working when trying to
    // waitForSelector/waitForTimeout/anything really so need this
    await page.goto(process.env.BASE_URL + '/statistics');
    await expect(page).toMatchElement('text', { text: 'Personal Analytics' });
    await expect(page).toClick('#analytics');

    //wait for analytics to load
    await page.waitForSelector('#neutral', { visible: true });

    await expect(page).toMatchElement('#neutral');

    await expect(page).toClick('#analytics');
  });

  it('Displays response in line chart', async () => {
    await expect(page).toMatchElement('.chartjs-render-monitor');
  });

  it('Displays response in word cloud', async () => {
    await expect(page).toClick('#lineChart');
    await page.waitForTimeout(100);
    await page.waitForSelector('#enablersWords');
    await expect(page).toClick('#enablersWords');

    await page.waitForSelector('#wordGraphic', { visible: true });
    await new Promise(r => setTimeout(r, 500));

    await expect(page).toMatchElement('text', { text: 'test' });
  });

  it('Checks if mentoring filter works', async () => {
    await expect(page).toClick('span', { text: 'Any' });
    await page.waitForTimeout(100);
    await expect(page).toClick('a', { text: 'Yes' });

    await new Promise(r => setTimeout(r, 500));

    //as we filled out one form which was not a self-report
    await expect(page).toMatchElement('h5', {
      text: 'No results found',
    });
  });
});
