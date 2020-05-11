const rp = require('request-promise');
const cheerio = require('cheerio');
const os = require('os');
const path = require('path');
const fs = require('fs');
const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require('worker_threads');
const workerPath = path.resolve('worker.js');

var scrapedData = [];
url = 'https://www.channelnewsasia.com/news/singapore';
rp(url).then((html) => {
    var toScrapeUrls = {
      articles: [{
        url: ''
      }]
    };
    var $ = cheerio.load(html);
    // $('.teaser__heading a[href]').each((index, value) => { 
    $('div.u-grid.is-separated-by-line a[href]').each((index, value) => {
      var link = $(value).attr('href');
      data = {
        url: 'https://www.channelnewsasia.com' + link
      };
      toScrapeUrls['articles'].push(data);
    });
    toScrapeUrls.articles.splice(0, 1);
    // return a list of links scraped;
    return toScrapeUrls;
  })
  .then((data) => {
    onCrawl(data)
      .then((scrapedData) => {
        console.log("crawled ended..........\n\n\n\n\n\n\n");
        // console.log(scrapedData);
        const jsonString = JSON.stringify(scrapedData, null, 2);
        fs.writeFile('./scraped.json', jsonString, err => {
          if (err) console.log('Error writing file', err);
          else console.log('Successfully wrote file');
        });
      });
  }).catch((err) => {
    console.log("error is", err);
  });


async function onCrawl(arr) {
  let json = {
    articles: []
  };
  await Promise.all(
    arr.articles.map(
      url =>
      new Promise((resolve, reject) => {
        const newID = Math.floor(Math.random() * 11000000);
        const worker = new Worker(workerPath, {
          workerData: {
            url: url,
            id: newID
          }
        });
        worker.on('message', (results) => {
          // console.log("worker returned with results from article: "+results.title);
          // console.log(results);
          if (results !== 'err') json['articles'].push(results);
          resolve();
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
      })
    )
  );
  console.log("onCrawl Function completed...")
  return json;
};
