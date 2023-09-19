

let musicContainer = document.querySelector(".music-container");
let timelineContainer = document.querySelector(".timeline-container");
let playPauseBtn = document.querySelector("#playPause");
let audio = document.querySelector("audio");
let progress = document.getElementById("progress");
let song = document.getElementById("music");
let currentTime = document.querySelector(".current-time");
let totalTime = document.querySelector(".total-time");
let ctrlIcon = document.getElementById("playPause");

timelineContainer.style.setProperty("--background", "black")

const music_list = [
  {
    img: "./_images/cd.jpg",
    name: "Swan Lake - Act IV Finale",
    artist: "Tchaikovsky",
    music: "./_music/swan-lake.mp3",
  },
]

//Play/Pause button toggle
playPauseBtn.addEventListener("click", togglePlay)

/*Play/Pause*/
function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
  if (ctrlIcon.classList.contains("fa-pause")) {
    song.pause();
    ctrlIcon.classList.remove("fa-pause")
    ctrlIcon.classList.add("fa-play")
  } else {
    song.play();
    ctrlIcon.classList.add("fa-pause")
    ctrlIcon.classList.remove("fa-play")
  }
}

//Add paused class on paused and remove on play
audio.addEventListener("play", () => {
  musicContainer.classList.remove("paused")
})

audio.addEventListener("pause", () => {
  musicContainer.classList.add("paused")
})

function reset() {
  currentTime.textContent = "00:00";
  totalTime.textContent = "00:00";
}

//Timeline

//If mouse is moving starts handleTimelineUpdate
timelineContainer.addEventListener("mousemove", handleTimelineUpdate)

//If mouse is pressed down, toggle scrubbing
timelineContainer.addEventListener("mousedown", toggleScrubbing)

//Only enter scrubbing when in timeline and clicking down
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e)
})

//If scrubbing starts handleTimelineUpdate
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect()
  //e.x gives position of X of mouse cursor, relative to timeline.
  //0 is so cursor doesn't go past limit. 
  //Rect.width is furthest right position
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  //Determines if left button is being click, if yes, enables scrubbing
  isScrubbing = (e.buttons & 1) === 1
  musicContainer.classList.toggle("scrubbing", isScrubbing)
  //If scrubbing, pause audio
  if (isScrubbing) {
    wasPaused = audio.paused
    audio.pause()
  } else {
    //Move audio where scrubbing was stopped then play
    audio.currentTime = percent * audio.duration
    if (!wasPaused) audio.play()
  }

  //If scrubbing starts, pulls code from handleTimelineUpdate 
  handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect()
  //e.x gives position of X of mouse cursor, relative to timeline.
  //0 is so cursor doesn't go past limit. 
  //Rect.width is furthest right position
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  //Math.floor((percent * audio.duration)) gives value for how far into audio
  //Determines image according to how they were set up, 10 seconds
  timelineContainer.style.setProperty("--preview-position", percent)

  //Scrubbing Settings
  if (isScrubbing) {
    //Prevents highlighting page while scrubbing
    e.preventDefault()
    timelineContainer.style.setProperty("--progress-position", percent)
  }
}

//Current Time
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatDuration(audio.currentTime)
  //Bar will move with audio progress
  const percent = audio.currentTime / audio.duration
  timelineContainer.style.setProperty("--progress-position", percent)
})

//Duration Counter
audio.addEventListener("loadeddata", () => {
  totalTime.textContent = formatDuration(audio.duration)
})

//Makes time say :04 instead of :4
const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
})

//Created to display duration time in full instead of seconds
function formatDuration(time) {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60) % 60
  const hours = Math.floor(time / 3600)
  //If no hours display minutes, if so show with minutes
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes)}:${leadingZeroFormatter.format(seconds)}`
  }
}

/*
    song.onloadedmetadata = function () {
      progress.max = song.duration;
      progress.value = song.currentTime;
    }

                    function playPause() {
                      if (ctrlIcon.classList.contains("fa-pause")) {
                        song.pause();
                        ctrlIcon.classList.remove("fa-pause")
                        ctrlIcon.classList.add("fa-play")
                      } else {
                        song.play();
                        ctrlIcon.classList.add("fa-pause")
                        ctrlIcon.classList.remove("fa-play")
                      }
                    }*/
/*
                        function delayPause() {
                          playPause();
                          setTimeout(() => {
                            playPause();
                          }, "1000");
                        }
            
                        if (song.play()) {
                          setInterval(() => {
                            progress.value = song.currentTime;
                          }, 1000)
                        }
            
                        progress.onchange = function () {
                          song.play();
                          song.currentTime = progress.value;
                          ctrlIcon.classList.add("fa-pause")
                          ctrlIcon.classList.remove("fa-play")
                        }
            */

