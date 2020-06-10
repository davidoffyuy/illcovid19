const puppeteer = require('puppeteer');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const delay = require('./util/delay');
let county = '';

const getCovid19 = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});

  await page.goto('https://www.dph.illinois.gov/covid19/covid19-statistics');
  
  //Click on 'By County' to show statistics and sort by each county. Delay is used to allow SPA function to complete.
  await page.click('.pagination > li:first-child > a');
  await delay(2000);

  //Input County into input field
  await page.focus('#input-filter');
  page.keyboard.type(county);
  await delay (1000);

  //Get list and the number of dates displayed. Last element is an arrow and not a date.
  const dateListElements = await page.$$('#paginMap > li');
  const dateLength = dateListElements.length - 1;
  
  // we want to create a loop that traverses each date and add it to a newly created data object.
  let CovidData = [];
  for (let i = dateLength - 1; i > 0; i--) {
    //Click on the date and wait to load
    await page.click('#paginMap > li:nth-child(' + (i + 1) + ') > a' );
    await delay (500);

    // get data and push to array
    const detailedData = await page.$('#detailedData');
    let caseCount = await page.evaluate(el => {
      return el.querySelector('tbody > tr > td:nth-child(3)').innerHTML;
    }, detailedData);
    console.log(caseCount);

    let deathCount = await page.evaluate(el => {
      return el.querySelector('tbody > tr > td:nth-child(4)').innerHTML;
    }, detailedData);
    console.log(deathCount);
  }



  // const testValue = await page.evaluate(el => el.querySelector('li:nth-last-child(2) > a').innerHTML, dateListElement);
  // const listElements = await dateListElement.$$('li');
  // console.log('Length: ' + listElements.length);
  // const testValue = await page.evaluate(el => el.querySelector('a').innerHTML, listElements[2]);
  // console.log('testValue: ' + testValue);

  // const testValue = await page.evaluate(el => {
  //   'document.querySelector(\'li:last-child(2) > a\').innerHTML;');

  // Test screenshot to show page has loaded
  // await page.screenshot({path: 'test.png'});

  await browser.close();
};

// Reading user inputting the county. This is will call all other functions.
readline.question(`County?`, (inputCounty) => {
  readline.close();

  // Set the county
  county = inputCounty;
  // console.log("County: " + county);

  // Begin crawling website
  getCovid19();
});


