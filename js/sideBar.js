document.querySelector('#slide').addEventListener('click', function(e) {
  // console.log('try:');
  const cn = document.getElementById('sideBar').className;
  // console.log(cn);
  if (cn === 'passive') {
    // console.log('yep');
    document.querySelector('#sideBar').classList.remove('passive');
    document.querySelector('#sideBar').classList.add('active');
  } else if (cn === 'active') {
    document.querySelector('#sideBar').classList.remove('active');
    document.querySelector('#sideBar').classList.add('passive');
  };
});

// put all testing of markers against all three (day of week, date range, time range) all at once.

// date range, input is mark
const testDate = mark => {
  const tempDate = new Date(mark.tag.date);
  const values = document.querySelector('#date-range-slider').noUiSlider.get()
  const handleOneDate = new Date(start_date.getTime()+values[0] * msPerDay);
  const handleTwoDate = new Date(start_date.getTime()+values[1] * msPerDay);
  if (tempDate.getTime()<handleOneDate.getTime() || tempDate.getTime()>handleTwoDate.getTime()) {
    return false;
  } else {
    return true;
  };
};

// time range, input is marker
const testTime = mark => {
  const values = $('#time-range-slider').data("roundSlider").getValue();
  const t1 = parseInt(values.split(',')[0]);
  const t2 = parseInt(values.split(',')[1]);
  const startTime = mark.tag.time.split(':');
  const hrs = startTime[0];
  const mins = startTime[1];
  const minutes = parseInt(mins) + (60 * parseInt(hrs));
  if (t1 > t2 && minutes < t2) {
    return true;
  } else if (t1 > t2 && minutes > t2 && minutes < t1) {
    return false;
  } else if (t1 > t2 && minutes > t1) {
    return true;
  } else if (minutes < t1) {
    return false;
  } else if (minutes > t2) {
    return false;
  } else {
    return true;
  };
};

const testDayOfWeek = mark => {
  const date = new Date(mark.tag.date);
  const dayStrings = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const day = date.getDay();
  if (document.querySelector('#'+dayStrings[date.getDay()]+':checked')) {
    return true;
  } else {
    return false;
  };
};

const testAndDisplay = () => {
  for (i=0; i<markerArray.length; i++) {
    const mark = markerArray[i];
    testDayOfWeek(mark);
    // console.log(testDate(mark));
    if (testTime(mark) && testDate(mark) && testDayOfWeek(mark)) {
      mark.setVisible(true);
    } else {
      mark.setVisible(false);
    };
  };
};


// <!-- script for the date-range -->
const msPerDay = 1000 * 60 * 60 * 24
const slider = document.getElementById('date-range-slider');
const start_date = new Date('April 7, 2019')
// console.log('start date: '+start_date);
const current_date = new Date();
// console.log('current date: '+current_date);
const days_since_start = Math.ceil((current_date - start_date) / msPerDay);
console.log(days_since_start);
noUiSlider.create(slider, {
  start: [0, days_since_start],
  connect: true,
  range: {
    'min': 0,
    'max': days_since_start
  },
  step: 1,
  // tooltips: true
});

const dateToDisplay = date => {
  return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
}
const getDates = values => {
  handleOneDate = new Date(start_date.getTime()+values[0] * msPerDay);
  handleTwoDate = new Date(start_date.getTime()+values[1] * msPerDay);
  document.querySelector('#start-date-display').innerHTML = dateToDisplay(handleOneDate);
  document.querySelector('#end-date-display').innerHTML = dateToDisplay(handleTwoDate);
  testAndDisplay();
};

getDates(slider.noUiSlider.get());
slider.noUiSlider.on('slide', getDates);


// <!-- script for time-range; requires jquery-->

window.minsToClockTime = s => {
  let hour = (Math.floor(s.value / 60));
  let min = (s.value%60);
  if (min < 10) {min = '0'+min.toString()};
  let m;
  if (hour < 12) {m = 'AM'} else {m = 'PM'};
  if (hour >= 12) {hour -= 12};
  if (hour == 0) {hour = 12};
  if (hour < 10) {hour = hour.toString()};
  return hour + ':' + min + ' ' + m
};

// const getMins =

const displayPinsByTime = val => {
  const t1 = parseInt(val.value.split(',')[0]);
  const t2 = parseInt(val.value.split(',')[1]);
  for (i=0; i<markerArray.length; i++) {
    const mark = markerArray[i];
    const startTime = mark.tag.time.split(':');
    const hrs = startTime[0];
    const mins = startTime[1];
    const minutes = parseInt(mins) + (60 * parseInt(hrs));
    if (t1 > t2 && minutes < t2) {
      mark.setVisible(true);
    } else if (t1 > t2 && minutes > t2 && minutes < t1) {
      mark.setVisible(false);
    } else if (t1 > t2 && minutes > t1) {
      mark.setVisible(true);
    } else if (minutes < t1) {
      mark.setVisible(false);
    } else if (minutes > t2) {
      mark.setVisible(false);
    } else {
      mark.setVisible(true);
    };
  };
  testTime();
};

const initPlacement = () => {
  $('#time-range-slider').roundSlider('setValue','0, 1439');
}

$.fn.roundSlider.prototype._invertRange = true;
$('#time-range-slider').roundSlider({
  radius: 85,
  sliderType: 'range',
  value: '0, 1439',
  startAngle: 90,
  max: 24 * 60 - 1,
  step: 1,
  handleShape: "square",
  width: 10,
  handleSize: '+8',
  tooltipFormat: 'minsToClockTime',
  editableTooltip: false,
  drag: testAndDisplay,
  change: testAndDisplay,
  create: initPlacement,
});
