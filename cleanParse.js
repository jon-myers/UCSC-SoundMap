const papa = require('papaparse');
const fs = require('fs');
const file = fs.createReadStream('UCSCSoundMap.csv');


// see if DB already exists?
const readCSV = file => {
  return new Promise(resolve => {
    papa.parse(file, {
      complete: function(results) {
        resolve(results.data);
      },
    });
  });
};

const writeMark = (keys,entry) => {
  let object = {};
  cleanKeys(keys);
  for (i=0; i < keys.length; i++) {
    object[keys[i]] = entry[i];
  };
  return object
}

const cleanKeys = keys => {
  for (i=0;i<keys.length;i++) {
    keys[i] = keys[i].replace(/ /g,'_');
  };
}

const saveResultAsJSON = result => {
  let data = JSON.stringify(result);
  data = 'pinsCallback({"type":"featureCollection","features":' + data + '})';
  fs.writeFileSync('pins.js', data);
}


async function asyncReadCSV(file) {
  result = await readCSV(file);
  rowNames =  result[0];
  entries = result.slice(1);
  arrayOfMarks = [];
  entries.forEach( entry => {
    arrayOfMarks.push(writeMark(rowNames,entry))
  });
  saveResultAsJSON(arrayOfMarks);
};




asyncReadCSV(file)
