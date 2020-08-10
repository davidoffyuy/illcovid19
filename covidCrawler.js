const puppeteer = require("puppeteer");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const delay = require("./util/delay");
const removeSpace = require("./util/removeSpace");
const dateText = require("./util/getDateText");
const getDateText = require("./util/getDateText");

//Function will use Puppeteer to get all data
const getCovidData = async (county) => {

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
  for (let i = 0; i <= dateLength - 1; i++) {
    //Click on the date and wait to load
    let dateLink = await page.$("#paginMap > li:nth-child(" + (i + 1) + ") > a");
    await dateLink.click();
    await delay(2000);

    // get data from page
    let dataDate = await page.evaluate((el) => el.innerHTML, dateLink);
    console.log(dataDate);

    const detailedData = await page.$("#detailedData");

    let testCount = await page.evaluate((el) => {
      return el.querySelector("tbody > tr > td:nth-child(2)").innerHTML;
    }, detailedData);
    console.log(testCount);

    let caseCount = await page.evaluate((el) => {
      return el.querySelector("tbody > tr > td:nth-child(3)").innerHTML;
    }, detailedData);
    console.log(caseCount);

    let deathCount = await page.evaluate((el) => {
      return el.querySelector("tbody > tr > td:nth-child(4)").innerHTML;
    }, detailedData);
    console.log(deathCount);

    // create object with data and push to array
    CovidData.push({ date: removeSpace(dataDate), tests: testCount, cases: caseCount, deaths: deathCount });
  }

  console.log("Covid Data");
  console.log(CovidData);
  await browser.close();
  return CovidData
};


const createCSV = (county, data) => {
  const csvWriter = createCsvWriter({
    path: 'results/' + county + getDateText() + '.csv',
    header: [
        {id: 'date', title: 'DATE'},
        {id: 'tests', title: 'TESTS'},
        {id: 'cases', title: 'CASES'},
        {id: 'deaths', title: 'DEATHS'}
    ]
  });

  return csvWriter.writeRecords(data)       // returns a promise
    .then(() => {
        console.log('Write To File Done');
    });

}

//Helper Function to call getCovidData and createCSV at the same time w/ one call
const completeCovid = async (county) => {
  const data = await getCovidData(county);
  return await createCSV(county, data);
}

exports.getCovidData = getCovidData;
exports.createCSV = createCSV;
exports.completeCovid = completeCovid;