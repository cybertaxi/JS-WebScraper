# JS-Web-Scraper
To Run:
node mainthread.js

Function:
Using Cheerio and request promise to scrape Singapore CNA headline news page.
Returns only the article title, images, article (scraped on their individual page) in a json file (scraped.json)
This scrapper comprises of worker threads to scrape the pages individually.



Things to improve:
1. json file contents will not be delete if scrapper is call again.
2. Making it deployable on server as cronjob.
