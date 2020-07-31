const covidCrawler = require("./covidCrawler");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// PROGRAM STARTS HERE
// Reading user inputting the county. This is will call all other functions.
readline.question(`County?\n`, (inputCounty) => {
  readline.close();

  // Get county name to store
  let countyName = inputCounty.toLocaleLowerCase();

  // Crawling website
  covidCrawler.getCovid19(countyName).then(data => covidCrawler.createCSV(countyName, data));
});
