const covidCrawler = require("./covidCrawler");
const removeSpace = require("./util/removeSpace");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// PROGRAM STARTS HERE
// Reading user input. Comma separated string supported.
readline.question(`County? (use comma for multiple)\n`, (inputCounties) => {
  readline.close();

  // Get county name to store
  let counties = removeSpace(inputCounties).toLocaleLowerCase().split(",");
  console.log(counties);

  // Crawl Illinois' Covid19 data website for data
  covidCrawler.getCovid19(counties[0]).then(data => covidCrawler.createCSV(counties[0], data));
});
