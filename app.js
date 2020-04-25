const puppeteer = require('puppeteer');
const shouldExit = 0;

const delay = (t, val) => {
  return new Promise(function(resolve) {
      setTimeout(function() {
          resolve(val);
      }, t);
  });
}

const getCovid19 = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});

  await page.goto('https://www.dph.illinois.gov/covid19/covid19-statistics');
  // await page.evaluate('document.querySelector(\'.pagination > li:first-child > a\').click();');
  
  await page.click('.pagination > li:first-child > a');
  await delay(2000);

  await page.screenshot({path: 'test.png'});

  await browser.close();
};

getCovid19();