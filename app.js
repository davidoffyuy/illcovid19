const puppeteer = require('puppeteer');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const delay = require('./util/delay');
const shouldExit = 0;
let county = '';

const getCovid19 = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});

  await page.goto('https://www.dph.illinois.gov/covid19/covid19-statistics');
  
  // Click on 'By County' to show statistics and sort by each county. Delay is used to allow SPA function to complete.
  await page.click('.pagination > li:first-child > a');
  await delay(2000);

  // Input County into input field
  await page.focus('#input-filter');
  page.keyboard.type(county);
  await delay (1000);

  const dateListElement = await page.$('#paginMap');
  const testValue = await page.evaluate(el => el.querySelector('li:nth-last-child(2) > a').innerHTML, dateListElement);
  // const testValue = await page.evaluate(el => {
  //   'document.querySelector(\'li:last-child(2) > a\').innerHTML;');
  console.log("testValue: " + testValue);

  // Test screenshot to show page has loaded
  // await page.screenshot({path: 'test.png'});

  await browser.close();
};

// Reading user inputting the county. This is will all other functions are called.
readline.question(`County?`, (inputCounty) => {
  readline.close();

  // Set the county
  county = inputCounty;
  // console.log("County: " + county);

  // Begin crawling website
  getCovid19();
});


