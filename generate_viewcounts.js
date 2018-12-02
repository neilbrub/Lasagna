var axios = require('axios')
var fs = require('fs');
var { convertArrayToCSV } = require('convert-array-to-csv');

/**
 * Gets {popSize} most recent videos from channel specified by {channelId}.
 * Writes array of viewcounts for each video to csv file.
 */

const API_KEY = fs.readFileSync('./key.txt', { encoding: 'utf-8' });
const channelId = 'UC-lHJZR3Gqxm24_Vd_AJ5Yw&key=AIzaSyAKxw3Kpz94cyyW8_45_XNyX2UsowLfWBE';
const fileName = 'pewds.csv';
const popSize = 500;

var searchListUrl = `https://www.googleapis.com/youtube/v3/search?order=date&maxResults=50&part=snippet&channelId=${channelId}&key=${API_KEY}`;
function videoUrl(id) { return `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=statistics&key=${API_KEY}` }
var views = [];
var header = ['Views'];

// Initiate
getPage('');

/**
 * Takes in array of search results of kind #searchListResponse
 */
async function addPage(results, nextPageToken) {
  // Convert search response items to video statistics
  await results.forEach(result => {
    axios.get(videoUrl(result.id.videoId)).then(vid => {
      try {
        var viewCount = vid.data.items[0].statistics.viewCount;
        // Save this to our cumulative array
        views.push([Number(viewCount)]);
      } catch(err) { /* Do nothing */ }
    })
  })

  if (views.length < popSize) {
    // Get next page
    getPage(nextPageToken)
  } else {
    // We're done!
    views = views.slice(0, popSize);
    var viewsCSV = convertArrayToCSV(views, { header })
    fs.writeFile(fileName, viewsCSV);
  }
}

/**
 * Gets searchlist for given page (defaults to page 1)
 */
function getPage(pageToken) {
  if (pageToken) {
    searchListUrl += `&pageToken=${pageToken}`;
  }
  axios.get(searchListUrl).then(result => {
    try {
      var results = result.data.items;
      var nextPageToken = result.data.nextPageToken;
      addPage(results, nextPageToken);
    } catch (err) {
      console.warn(err.message);
    }
  });
}
