const {
    Worker,
    parentPort,
    workerData
} = require('worker_threads');
var rp = require('request-promise');
const cheerio = require('cheerio');
// get the array numbers
var data = workerData;
// console.log("1")
const results = "done";
// return result

const json = {};
let para = "";

//process the next step of crawling the webpage
const url = data.url;
console.log("worker_" + data.id + " sprawned and working...");
rp(url).then((html) => {
        var $ = cheerio.load(html);

        //get title
        $('.article__title').filter(function () {
            json.title = $(this).text();
        });
        try {
            //get all the images urls

            var imageURLs = $('.picture__container')
                .children('source')
                .attr('data-srcset')
                .split(', ')
                .map(link => link.substr(0, link.length - 5));
        } catch (err) {
            console.log("Error in imageurl: ", json.title);
        };
        json.imageURL = imageURLs !== undefined ? imageURLs : [""];

        // console.log(json);
        let paraArticle = $('.c-rte--article').find('p') || "";

        paraArticle.each((index, value) => {
            const data = $(value).text();
            if (data !== '' && !(index === paraArticle.length - 1)) {
                para += data;
            }
        });
        json.para = para;
        parentPort.postMessage(json);
})
.catch((err) => {
    console.log("error was : ", err);
    parentPort.postMessage("err");
});