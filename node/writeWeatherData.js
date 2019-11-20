const fs = require('fs');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const formatDateTime = (date, time) => {
  time = time.split(':');
  time = parseInt(time[0]) + Math.round(parseInt(time[1])/60);
  time = time+':00:00';
  date = date.split('/');
  for (j =0; j < date.length; j++) {
    if (date[j].length == 1) {date[j] = '0'+date[j]}
  };
  date = date.join('-');
  date = new Date(date+'T'+time);
  date = date.getTime()/1000;
  console.log(date);
  return date;
}

fs.readFile('data.json', 'utf8', (err, data) => {
  data = JSON.parse(data).features;
  const currentTemps = [];
  let count = 0;
  for (i=0; i < data.length; i++) {
    const lat = data[i].latitude;
    const lon = data[i].longitude;
    const date = data[i].date;
    const time = data[i].start_time;
    const dateTime = formatDateTime(date, time);
    const url = 'http://localhost:8010/proxy/'+lat+','+lon+','+dateTime;
    console.log(url);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        currentTemps.push(JSON.parse(xhr.responseText).currently);
        count++;
        if (count == data.length) {
          const ctJSON = {};
          for (k=0; k<count; k++) {
            ctJSON[k+1] = currentTemps[k];
            let ctJSONString = JSON.stringify(ctJSON);
            fs.writeFileSync('currentTemps.json',ctJSONString);
          };

        }
      };
    };
    xhr.open('GET', url, true);
    xhr.send('')
  };
})


// last item =
// type this into terminal first
// lcp --proxyUrl https://api.darksky.net/forecast/19e96fcdb69b584cd909e94f0a590f9a



//
// const load = (url) => {
//   const xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = () => {
//     if (xhr.readyState === 4) {
//       console.log(JSON.parse(xhr.response));
//     }
//   }
//   xhr.open('GET', url, true);
//   xhr.send('')
// };
// // load(url);
