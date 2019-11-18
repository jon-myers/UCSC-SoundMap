// for omnitone
function crossProduct(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
};
// for omnitone
function normalize(a) {
  var n = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  a[0] /= n;
  a[1] /= n;
  a[2] /= n;
  return a;
};

function traceEvent(e) {
  onDirectionChange(e.value);
};

var AudioPlayer = function(options) {
  this.options = options || {};
  // context for addEventListener
  var self = this;
  // HTML MEDIA ELEMENT (AUDIO TAG)
  // get audio-file element from DOM
  this.audioFile = document.getElementById('audio-file') || null;
  this.audioFile.crossOrigin = 'anonymous';
  this.audioPreload = 'auto' || this.options.audioPreload;
  this.audioSource = this.options.audioSource;
  this.audioType = 'audio/wav' || this.options.audioType;
  // check where audio tag exists
  if (this.audioFile) {
    // set attributes on audio tag
    this.audioFile.setAttribute('preload', this.audioPreload);
    // this.audioFile.setAttribute('itemprop', 'audio');
    // create source tag
    this.sourceTag = document.createElement('source');
    // add source tag inside of audio tag
    // this.audioFile.appendChild(this.sourceTag);
    // set attributes on source tag
    this.sourceTag.setAttribute('src', this.audioSource);
    this.sourceTag.setAttribute('type', this.audioType);
    // add event
    this.audioFile.ontimeupdate = function() {
      self.updateTime();
    };
    // add event
    this.audioFile.ondurationchange = function() {
      self.displayAudioDuration();
    };
  } else {
    console.log('error - no audio tag with id audio-file present in html');
  }

  // AUDIO PLAYER
  // get audio-player element from DOM
  this.audioPlayerContainer = document.getElementById('audio-player') || null;
  // check audio file present then provide fallback to default browser audio player
  if (this.audioFile && !this.audioPlayerContainer) {
    var controlsAttribute = document.createAttribute('controls');
    this.audioFile.setAttributeNode(controlsAttribute);
    // check audio file present then include audio player
  } else if (this.audioFile && this.audioPlayerContainer) {

    // PLAY / PAUSE
    // create a flag
    this.playPauseBtnInclude =  (this.options.playPauseBtn === false) ? false : true;
    // check value to determine whether to include
    if (this.playPauseBtnInclude) {
      // create box
      var playPauseBtnBox = document.createElement('div');
      playPauseBtnBox.setAttribute('class', 'box-playpause');
      // create audio start time element
      var playPauseBtnEl = document.createElement('div');
      playPauseBtnEl.setAttribute('id', 'play-pause-btn');
      playPauseBtnEl.innerHTML = '&#x25b6';
      // add element to box
      playPauseBtnBox.appendChild(playPauseBtnEl);
      // set element to use for play/pause button used in methods
      this.playPauseBtn = playPauseBtnEl;
      // add box that in includes play/pause button element to audio player
      this.audioPlayerContainer.appendChild(playPauseBtnBox);
      // add event
      this.playPauseBtn.addEventListener('click', function() {
        self.playPauseAudio();
      }, false);
    }

    // STOP
    // create a flag
    this.stopBtnInclude =  (this.options.stopBtn === false) ? false : true;
    // check value to determine whether to include
    if (this.stopBtnInclude) {
      // create box
      var stopBtnBox = document.createElement('div');
      stopBtnBox.setAttribute('class', 'box-stopbtn');
      // create audio start time element
      var stopBtnEl = document.createElement('div');
      stopBtnEl.setAttribute('id', 'stop-btn');
      // add element to box
      stopBtnBox.appendChild(stopBtnEl);
      // set element to use for play/pause button used in methods
      this.stopBtn = stopBtnEl;
      // add box that in includes play/pause button element to audio player
      this.audioPlayerContainer.appendChild(stopBtnBox);
      // add event
      this.stopBtn.addEventListener('click', function() {
        self.stopAudio();
      }, false);
    }

    // AUDIO START TIME
    // create a flag
    this.audioFileStartInclude = (this.options.audioFileStart === false) ? false : true;
    // check value to determine whether to include
    if (this.audioFileStartInclude) {
      // create box
      var audioFileStartBox = document.createElement('div');
      audioFileStartBox.setAttribute('class', 'box-audiofilestart');
      // create audio start time element
      var audioFileStartEl = document.createElement('div');
      audioFileStartEl.setAttribute('id', 'audio-file-start');
      audioFileStartEl.innerHTML = '0:00';
      // add element to box
      audioFileStartBox.appendChild(audioFileStartEl);
      // set element to use for audio file start time used in methods
      this.audioFileStart = audioFileStartEl;
      // add box that in includes audio start time element to audio player
      this.audioPlayerContainer.appendChild(audioFileStartBox);
    }

    // PROGRESS BAR
    // create a flag
    this.progressBarInclude = (this.options.progressBar === false) ? false : true;
    // check value to determine whether to include
    if (this.progressBarInclude) {
      // create box
      var progressBarBox = document.createElement('div');
      progressBarBox.setAttribute('class', 'box-progressbar');
      progressBarBox.setAttribute('id', 'bpb')
      // create progress bar container
      var progressBarContainerEl = document.createElement('div');
      progressBarContainerEl.setAttribute('id', 'audio-progress-container');
      // create progress bar
      var progressBarEl = document.createElement('div');
      progressBarEl.setAttribute('id', 'audio-progress-bar');
      // add bar element to container element
      progressBarContainerEl.appendChild(progressBarEl);
      // add container element (including bar element) to box
      progressBarBox.appendChild(progressBarContainerEl);
      // set element used in methods
      this.audioProgressContainer = progressBarContainerEl;
      // set element used in methods
      this.audioProgressBar = progressBarEl;
      // add box that in includes progress container and bar to audio player
      this.audioPlayerContainer.appendChild(progressBarBox);
      // add event
      this.audioProgressContainer.addEventListener('click', function() {
        self.setAudioPosition(this,event);
      }, false);
    }

    // AUDIO DURATION (total time)
    // create a flag
    this.audioFileEndInclude = (this.options.audioFileEnd === false) ? false : true;
    // check value to determine whether to include
    if (this.audioFileEndInclude) {
      // create box
      var audioFileEndBox = document.createElement('div');
      audioFileEndBox.setAttribute('class', 'box-audiofileend');
      // create audio end time element
      var audioFileEndEl = document.createElement('div');
      audioFileEndEl.setAttribute('id', 'audio-file-end');
      audioFileEndEl.innerHTML = '0:00';
      // add element to box
      audioFileEndBox.appendChild(audioFileEndEl);
      // set element to use for audio file end time used in methods
      this.audioFileEnd = audioFileEndEl;
      // add box that in includes audio end time element to audio player
      this.audioPlayerContainer.appendChild(audioFileEndBox);
    }

    // VOLUME ICON AND BAR
    // create flags
    this.volumeIconInclude = (this.options.volumeIcon === false) ? false : true;
    this.volumeBarInclude = (this.options.volumeBar === false) ? false : true;
    // check values to determine whether to include
    if (this.volumeIconInclude && this.volumeBarInclude) {
      // create box
      var volumeIconBox = document.createElement('div');
      volumeIconBox.setAttribute('class', 'box-volumeicon');
      // create volume element
      var volumeIconContainerEl = document.createElement('div');
      volumeIconContainerEl.setAttribute('id', 'volume-icon-container');
      // create volume icon element
      var volumeIconEl = document.createElement('div');
      volumeIconEl.setAttribute('id', 'volume-icon');
      // create soundwave elements
      var volumeSoundwaveOne = document.createElement('span');
      volumeSoundwaveOne.innerHTML = ')';
      var volumeSoundwaveTwo = document.createElement('span');
      volumeSoundwaveTwo.innerHTML = ')';
      var volumeSoundwaveThree = document.createElement('span');
      volumeSoundwaveThree.innerHTML = ')';
      // add soundwaves to volume icon element
      volumeIconEl.appendChild(volumeSoundwaveOne);
      volumeIconEl.appendChild(volumeSoundwaveTwo);
      volumeIconEl.appendChild(volumeSoundwaveThree);
      // add volume-icon to volume icon container
      volumeIconContainerEl.appendChild(volumeIconEl);
      // add volume icon container to box
      volumeIconBox.appendChild(volumeIconContainerEl);
      // set element to use for volume icon
      this.audioVolume = volumeIconContainerEl;
      // add box audio player
      this.audioPlayerContainer.appendChild(volumeIconBox);
      // create box
      var volumeLevelBox = document.createElement('div');
      volumeLevelBox.setAttribute('class', 'box-volumelevel');
      // create volume level container
      var volumeLevelContainerEl = document.createElement('div');
      volumeLevelContainerEl.setAttribute('id', 'volume-level-container');
      // create volume level indicator
      var volumeLevelEl = document.createElement('div');
      volumeLevelEl.setAttribute('id', 'volume-level-indicator');
      // add volume level indicator to volume level container
      volumeLevelContainerEl.appendChild(volumeLevelEl);
      // add volume level container to box
      volumeLevelBox.appendChild(volumeLevelContainerEl);
      // set volume level container to use for methods
      this.volumeLevelContainer = volumeLevelContainerEl;
      // set volume level indicator to use for methods
      this.volumeLevelIndicator = volumeLevelEl;
      // add box audio player
      this.audioPlayerContainer.appendChild(volumeLevelBox);
      // add event
      this.audioVolume.addEventListener('click', function() {
        self.muteAudio();
      }, false);
      // add event
      this.volumeLevelContainer.addEventListener('click', function() {
        self.setNewVolume(this,event);
      }, false);
    }
    // create compass
    var compassBox = document.createElement('div');
    compassBox.setAttribute('class', 'box-compass');
    compassBox.setAttribute('background', 'url(resources/compassRose.jpg)');
    this.audioPlayerContainer.appendChild(compassBox);
    // create compass container
    var compass = document.createElement('div');
    compass.setAttribute('id', 'compass');
    compassBox.appendChild(compass);
  }

  // METHODS

  // display audio duration
  this.displayAudioDuration = function () {
    if (this.audioFileEndInclude) {
      this.audioFileEnd.innerHTML = Math.floor(this.audioFile.duration / 60) + ":" + (Math.floor(this.audioFile.duration % 60) < 10 ? '0' : '') + Math.floor(this.audioFile.duration % 60);
    }
  },

  // display current time of audio
  this.updateTime = function () {
    var currentSeconds = (Math.floor(this.audioFile.currentTime % 60) < 10 ? '0' : '') + Math.floor(this.audioFile.currentTime % 60);
    var currentMinutes = Math.floor(this.audioFile.currentTime / 60);
    if (this.audioFileStartInclude) {
      this.audioFileStart.innerHTML = currentMinutes + ":" + currentSeconds;
    }
    if (this.progressBarInclude) {
      var audioPlayedPercent = (this.audioFile.currentTime/this.audioFile.duration);
      var audioProgressPercent = this.audioProgressContainer.offsetWidth * audioPlayedPercent;
      this.audioProgressBar.style.width = Math.round(audioProgressPercent) + "px";
    }
    if (this.audioFile.currentTime == this.audioFile.duration) {
      if (this.playPauseBtnInclude) {
        this.playPauseBtn.innerHTML = "&#x25b6;";
        this.playPauseBtn.setAttribute("class", "");
      }
    };
  },

  // play / pause audio
  this.playPauseAudio = function () {
    if (this.audioFile.paused) {
      this.audioFile.play();
      this.playPauseBtn.innerHTML = "| |";
      this.playPauseBtn.setAttribute("class", "playing");
    } else {
      this.audioFile.pause();
      this.playPauseBtn.innerHTML = "&#x25b6;";
      this.playPauseBtn.setAttribute("class", "");
    }
  },
  // compute current audio time in %
  this.setAudioLocation = function(percentage) {
    this.audioFile.currentTime = this.audioFile.duration * percentage;
  },

  // display current audio progress
  this.setAudioPosition = function (element, e) {
    var audioProgressContainerWidth = element.offsetWidth;
    var eventObject = window.event ? event : e;
    var clickLocation = eventObject.layerX;
    var percentage = (clickLocation/audioProgressContainerWidth);
    this.setAudioLocation(percentage);
  },

  // compute volume % and update ui
  this.setVolume = function (percentage) {
    this.audioFile.volume = percentage;
    if (this.volumeIconInclude) {
      if(percentage > 0.6) {
        // display 3 soundwaves
        this.audioVolume.innerHTML = '<div id="volume-icon"><span>)</span><span>)</span><span>)</span></div>';
        // remove class attributes (remove "muted" class)
        this.audioVolume.setAttribute("class", "");
      } else if(percentage > 0 && percentage <= 0.3) {
        this.audioVolume.innerHTML = '<div id="volume-icon"><span>)</span></div>';
        // remove class attributes (remove "muted" class)
        this.audioVolume.setAttribute("class", "");
      } else if(percentage == 0) {
        // "muted" class is target by css to update ui
        this.audioVolume.setAttribute("class", "muted");
      } else {
        // display 2 soundwaves
        this.audioVolume.innerHTML = '<div id="volume-icon"><span>)</span><span>)</span></div>';
        // remove class attributes (remove "muted" class)
        this.audioVolume.setAttribute("class", "");
      }
    }

    if (this.volumeBarInclude) {
      var percentofVolumeLevelContainer = this.audioFile.volume / 1;
      var percentofVolumeLevelIndicator = this.volumeLevelContainer.offsetWidth * percentofVolumeLevelContainer;
      this.volumeLevelIndicator.style.width = Math.round(percentofVolumeLevelIndicator) + "px";
    }
  },

  // set volume based on user click on volume bar
  this.setNewVolume = function (element, e) {
    var volumeLevelContainer = element.offsetWidth;
    var eventObject = window.event? event: e;
    var clickLocation = eventObject.layerX;
    var percentage = (clickLocation/volumeLevelContainer);
    this.setVolume(percentage);
  },

  // stop audio and update ui
  this.stopAudio = function () {
    this.audioFile.currentTime = 0;
    this.audioFile.pause();
    if (this.playPauseBtnInclude) {
      this.playPauseBtn.innerHTML = "&#x25b6;";
      this.playPauseBtn.setAttribute("class", "");
    }
  },

  // toggle muted audio
  this.muteAudio = function () {
    var isMuted = this.audioVolume.getAttribute("class") == "muted" ? true : false;
    var currentVolume = this.audioVolume.getAttribute("muteVolume");
    if(isMuted == true) {
      this.setVolume(currentVolume);
      this.audioVolume.setAttribute("class", "");
    } else {
      if (this.volumeBarInclude) {
        var previousVolume = this.volumeLevelIndicator.offsetWidth / this.volumeLevelContainer.offsetWidth;
      }
      this.setVolume(0);
      this.audioVolume.setAttribute("class", "muted");
      if (this.volumeBarInclude) {
        this.audioVolume.setAttribute("muteVolume", previousVolume);
      } else {
        this.audioVolume.setAttribute("muteVolume", 1);
      }
    }
  }

  // override width to make the full width
  this.audioPlayerContainer.style.maxWidth = '100%';


  // set the playback to 100% - some number of pixels
  var progressBarWidth = window.innerWidth - 352 + 'px';
  console.log(progressBarWidth);
  this.bpb = document.getElementById('bpb');
  this.bpb.style.width = progressBarWidth;

  window.addEventListener("resize", () => {
    var progressBarWidth = window.innerWidth - 352 + 'px';
    console.log(progressBarWidth);
    this.bpb = document.getElementById('bpb');
    this.bpb.style.width = progressBarWidth;
  });





  // change di

};




// Create instance
// window.addEventListener('load', {var myAudioPlayer = new AudioPlayer()} )
var ct=0;
var myAudioPlayer = new AudioPlayer();

const onDirectionChange = (newAzimuthValue) => {
  let azimuthValue = newAzimuthValue;
  let elevationValue = 0;
  let theta = azimuthValue / 180 * Math.PI;
  let phi = elevationValue / 180 * Math.PI;
  let forward = [
    Math.sin(theta) * Math.cos(phi),
    Math.sin(phi),
    Math.cos(theta) * Math.cos(phi)
  ];
  let upInitial = [0, 1, 0];
  let right = normalize(crossProduct(forward, upInitial));
  let up = normalize(crossProduct(right, forward));
  rotationMatrix3[0] = right[0];
  rotationMatrix3[1] = right[1];
  rotationMatrix3[2] = right[2];
  rotationMatrix3[3] = up[0];
  rotationMatrix3[4] = up[1];
  rotationMatrix3[5] = up[2];
  rotationMatrix3[6] = forward[0];
  rotationMatrix3[7] = forward[1];
  rotationMatrix3[8] = forward[2];
  foaRenderer.setRotationMatrix3(rotationMatrix3)
};

  // ambisonic container
  const rotationMatrix3 = new Float32Array(9);
  const audioContext = new AudioContext();
  const audioElementSource = audioContext.createMediaElementSource(myAudioPlayer.audioFile);
  const foaRenderer = Omnitone.createFOARenderer(audioContext);
  Promise.all([foaRenderer.initialize()]).then((results) => {
    audioElementSource.connect(foaRenderer.input);
    foaRenderer.output.connect(audioContext.destination);
    foaRenderer.setRenderingMode('ambisonic');
  });
