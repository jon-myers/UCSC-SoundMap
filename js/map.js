const animateMapZoomTo = (map, targetZoom, commandedZoom) => {
  var currentZoom = commandedZoom || map.getZoom();
  if (currentZoom != targetZoom) {
    google.maps.event.addListenerOnce(map, 'zoom_changed', function (event) {
      animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
    });
    setTimeout(function(){ map.setZoom(currentZoom) }, 80);
  }
};

const make000 = num => {
  num = num.toString();
  if (num.length == 1) {
    num = '00'+num;
  } else if (num.length == 2) {
    num = '0'+num;
  };
  return num
};
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(36.9948,-122.0661),
    zoom: 15,
    mapTypeId: 'satellite',
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    }
  });
  const script = document.createElement('script');
  script.src = 'json/pins.js';
  document.getElementsByTagName('head')[0].appendChild(script);
  const temps = document.createElement('script');
  temps.src = 'json/currentTemps.js';
  document.getElementsByTagName('head')[0].appendChild(temps);
};

const transformDate = dateString => {
  const year = dateString.split('/')[0];
  const month = dateString.split('/')[1];
  const day = dateString.split('/')[2];
  return month + '/'+day+'/'+year;
}

const transformTime = timeString => {
  let hour = parseInt(timeString.split(':')[0]);
  const minute = timeString.split(':')[1];
  let m;
  if (hour >= 12) {hour -= 12; m = 'PM'} else {m = 'AM'};
  if (hour == 0) {hour = 12};
  return hour+':'+minute+' '+m;

}




const displayInfo = marker => {
  const date = transformDate(marker.tag.date);
  const time = transformTime(marker.tag.time);
  const dateTime = date + ' &#8212 ' + time;
  const catnum = 'Catalog Number: '+marker.tag.num;
  const textualInfo = marker.tag.textualInfo;
  const weather = marker.tag.temp.summary + ', ' + Math.round(marker.tag.temp.temperature) + '&deg; F';
  document.querySelector('#info-catalog-number').innerHTML = catnum;
  document.querySelector('#info-date-time').innerHTML = dateTime;
  document.querySelector('#textual-info').innerHTML = textualInfo;
  document.querySelector('#weather-info').innerHTML = weather;
}


let prevWindow;
const attachName = (marker, name, catalog_num) => {
  const infowindow = new google.maps.InfoWindow({
    content: name
  });
  marker.addListener('click', () => {
    displayInfo(marker);
    // document.querySelector('#show-info').innerHTML = marker.tag.time;
    // console.log(typeof prevWindow);
    if (prevWindow !== undefined) {
      prevWindow.close();
      prevWindow = infowindow;
    } else {
      prevWindow = infowindow;
    }
    infowindow.open(marker.get('map'), marker);
    animateMapZoomTo(map,17);
    map.panTo(marker.getPosition());
    let cat_num = marker.tag.num;
    var sc = 'https://soundmap.sfo2.digitaloceanspaces.com/UCSC/edited_catalog/'+catalog_num.toString()+'.wav';
    // myAudioPlayer.sourceTag.setAttribute('src', myAudioPlayer.audioSource);
    // console.log(myAudioPlayer.audioSource);
    // myAudioPlayer.audioElementSource.disconnect();
    var audioFileContents = document.getElementById('audio-file');
    while (audioFileContents.firstChild) {
      audioFileContents.removeChild(audioFileContents.firstChild)
    };
    srcElement = document.createElement("source");
    srcElement.setAttribute('src',sc);
    srcElement.setAttribute('type','audio/wav');
    audioFileContents.appendChild(srcElement);
    myAudioPlayer.audioFile = document.getElementById('audio-file');
    var playerContents = document.getElementById('audio-player');
    while (playerContents.firstChild) {
      playerContents.removeChild(playerContents.firstChild);
    };
    myAudioPlayer = new AudioPlayer();
    myAudioPlayer.audioFile.load();
    myAudioPlayer.setVolume(0.975);

    $("#compass").roundSlider({
        sliderType: "min-range",
        radius: 18,
        showTooltip: false,
        width: 0,
        value: 0,
        handleSize: 0,
        handleShape: "square",
        startAngle: 90 + marker.tag.orientation,
        min: 0,
        max: 360,
        beforeCreate: "traceEvent",
        create: "traceEvent",
        start: "traceEvent",
        stop: "traceEvent",
        change: "traceEvent",
        drag: "traceEvent"
    });
    document.getElementById('compass').setAttribute('background-color','red');
    // console.log(myAudioPlayer.audioFile.volume);
  });
};

const markerArray = [];

// Loop through the results array and place a marker for each
// set of coordinates.
window.pinsCallback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var lat = results.features[i].latitude;
    var lng = results.features[i].longitude;
    var num = results.features[i].catalog_number;
    var time = results.features[i].start_time;
    var date = results.features[i].date;
    var orientation = results.features[i].orientation;
    var textualInfo = results.features[i].colloquial_location;
    var latLng = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
      position: latLng, map: map, tag: {date: date, num: num, time: time,
      orientation: orientation, textualInfo: textualInfo}, icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
    });
    // console.log(results.features[i].catalog_number_);
    attachName(marker,results.features[i].colloquial_location,results.features[i].catalog_number);
    markerArray.push(marker);
  };
};

window.tempsCallback = temps => {
  for (let i = 0; i < Object.keys(temps).length; i++) {
    markerArray[i].tag.temp = temps[i+1];
  };
};

var mapHeight = window.innerHeight - 10 + 'px';
document.getElementById('map').style.height = mapHeight;

window.addEventListener("resize", () => {
  var mapHeight = window.innerHeight - 10 + 'px';
  document.getElementById('map').style.height = mapHeight;
});
