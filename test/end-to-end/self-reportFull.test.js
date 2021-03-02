import prisma from '../../lib/prisma';
import { logInAs } from './e2e-helper';

const numOfQs = 7;
describe('Fully filling in self report', () => {
  beforeAll(async () => {
    await page.goto(process.env.BASE_URL);
    await page.setViewport({ width: 1920, height: 1500 });
  });

  afterEach(async () => await prisma.$disconnect());

  it('Fills and submits form', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });
    await expect(page).toClick('a', { text: 'self-report' });
    await page.waitForNavigation();

    //wait for questions to load
    await page.waitForSelector('#q1a1', { visible: true });

    //answer all questions as neutral
    for (var i = 1; i <= numOfQs; i++) {
      await expect(page).toClick('#q' + i.toString() + 'a2');
    }

    //answer all enabler inputs as test
    var id;
    for (var i = 0; i < 3; i++) {
      id = 'wq' + (numOfQs + 1).toString() + 'i' + i.toString();
      await expect(page).toFill('input[id="' + id + '"]', 'test');
    }

    await expect(page).toClick('#submit');
    await page.evaluate(() => document.querySelector('#confirm').click());
    await page.waitForNavigation();
  });

  // it('Displays response in circles', async () => {
  //   await expect(page).toClick('#summary');

  //   //wait for circles to load
  //   await page.waitForSelector("[id='c0%50']", { visible: true });

  //   for (var i = 0; i < numOfQs; i++) {
  //     await expect(page).toMatchElement("[id='c" + i.toString() + "%50']");
  //   }

  //   await expect(page).toClick('#summary');
  // });

  // it('Displays response in analytics', async () => {
  //   await expect(page).toClick('#analytics');

  //   //wait for analytics to load
  //   await page.waitForSelector('#neutral', { visible: true });

  //   await expect(page).toMatchElement('#neutral');

  //   await expect(page).toClick('#analytics');
  // });

  // it('Displays response in line chart', async () => {
  //   await expect(page).toMatchElement('.chartjs-render-monitor');
  // });

  // it('Displays response in word cloud', async () => {
  //   await expect(page).toClick('#lineChart');
  //   await expect(page).toClick('text', { text: 'Enablers Word Cloud' });

  //   await page.waitForSelector('#wordGraphic', { visible: true });
  //   await expect(page).toMatchElement('text', { text: 'test' });
  // });
});
