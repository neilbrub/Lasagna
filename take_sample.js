var axios = require('axios')
var fs = require('fs');
var csvArray = require('csv-array');
var { convertArrayToCSV } = require('convert-array-to-csv');

/**
 * Given a viewcount population for a channel (saved to csv file), take a random sample of predetermined size.
 * Uses www.random.org's API
 */

const numSamples = 50;
const popSize = 500;

const populationFilename = 'tseries.csv';
const sampleResultFilename = 'sample_tseries.csv';

const url = `https://www.random.org/integers/?num=${numSamples*2}&min=1&max=${popSize}&col=1&format=plain&base=10&rnd=new`;

axios.get(url).then(result => {
  var numArray = result.data.split('\n');
  // Remove duplicates
  var indices = removeDuplicates(numArray);
  indices = indices.slice(0, numSamples);
  takeSample(indices);
})

function removeDuplicates(arr) {
  var uniques = [];
  for (var i = 0; i < arr.length; i++) {
    if (!uniques.includes(arr[i])){
      uniques.push(arr[i]);
    }
  }
  return uniques;
}

function takeSample(sampleIndices) {
  csvArray.parseCSV(populationFilename, population => {
    var sample = [];
    sampleIndices.forEach(index => {
      sample.push(population[Number(index)-1]);
    });
    var sampleCSV = convertArrayToCSV(sample);
    fs.writeFile(sampleResultFilename, sampleCSV);
  })
}