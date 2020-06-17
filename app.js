const puppeteer = require("puppeteer");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//UTILITIES
const delay = require("./util/delay");
const removeSpace = require("./util/removeSpace");

//GLOBAL DECLARATION
let county = "";

//Function will use Puppeteer to get all data
const getCovid19 = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://www.dph.illinois.gov/covid19/covid19-statistics");
  await delay(1000);

  //Click on 'By County' to show statistics and sort by each county. Delay is used to allow SPA function to complete.
  await page.click(".pagination > li:first-child > a");
  await delay(2000);

  //Input County into input field
  await page.focus("#input-filter");
  page.keyboard.type(county);
  await delay(1000);

  //Get list and the number of dates displayed. Last element is an arrow and not a date.
  const dateListElements = await page.$$("#paginMap > li");
  const dateLength = dateListElements.length - 1;

  // we want to create a loop that traverses each date and add it to a newly created data object.
  let CovidData = [];
  for (let i = dateLength - 1; i > 0; i--) {
    //Click on the date and wait to load
    let dateLink = await page.$("#paginMap > li:nth-child(" + (i + 1) + ") > a");
    await dateLink.click();
    await delay(500);

    // get data from page
    let dataDate = await page.evaluate((el) => el.innerHTML, dateLink);
    console.log(dataDate);

    const detailedData = await page.$("#detailedData");
    let caseCount = await page.evaluate((el) => {
      return el.querySelector("tbody > tr > td:nth-child(3)").innerHTML;
    }, detailedData);
    console.log(caseCount);

    let deathCount = await page.evaluate((el) => {
      return el.querySelector("tbody > tr > td:nth-child(4)").innerHTML;
    }, detailedData);
    console.log(deathCount);

    // create object with data and push to array
    CovidData.push({ date: removeSpace(dataDate), cases: caseCount, deaths: deathCount });
  }

  console.log("Covid Data");
  console.log(CovidData);
  await browser.close();
  return CovidData
};


const CreateCSV = (data) => {
  const csvWriter = createCsvWriter({
    path: 'results/' + county + '.csv',
    header: [
        {id: 'date', title: 'DATE'},
        {id: 'cases', title: 'CASES'},
        {id: 'deaths', title: 'DEATHS'}
    ]
  });

  csvWriter.writeRecords(data)       // returns a promise
    .then(() => {
        console.log('Write To File Done');
    });

}

// PROGRAM STARTS HERE
// Reading user inputting the county. This is will call all other functions.
readline.question(`County?\n`, (inputCounty) => {
  readline.close();

  // Set the county
  county = inputCounty;
  // console.log("County: " + county);

  // Crawling website
  getCovid19().then(data => CreateCSV(data));
});
