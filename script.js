// Nota: Scrubbing é o evento de se vasculhar uma timeline enquanto seguramos o cursos do mouse sobre ela

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
    id: "1",
    img: "./_images/cd1.jpg",
    name: "Swan Lake - Act IV Finale",
    artist: "Tchaikovsky",
    music: "./_music/swan-lake.mp3",
  },
  {
    id: "2",
    img: "./_images/cd2.jpg",
    name: "Swan Lake - Act IV Finale",
    artist: "Tchaikovsky",
    music: "./_music/swan-lake.mp3",
  },
]

//Play/Pause interruptor
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

// Adiciona pausado na classe e o remove quando o audio está em play
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

// Timeline

// Se o mouse está se movendo, starta o handleTimelineUpdate
timelineContainer.addEventListener("mousemove", handleTimelineUpdate)

//  Se o mouse é pressionado, alterna o gatilho de Scrubbing
timelineContainer.addEventListener("mousedown", toggleScrubbing)

// Só acionar o scrubbing quando estiver na timeline e o mouse pressionado
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e)
})

// Se está em scrubbing, startar handleTimelineUpdate
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect()
  // Entrega a posição x do cursor do mouse, relativo à timeline
  // o 0 é para que o cursor não ultrapasse o limite.
  // Rect.width é a posição mais a direita no elemento
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  // Determina se o botão direito está sendo clicado, se sim, permite o evento Scrubbing
  isScrubbing = (e.buttons & 1) === 1
  musicContainer.classList.toggle("scrubbing", isScrubbing)
  // Se está em scrubbing, pausar o audio
  if (isScrubbing) {
    wasPaused = audio.paused
    audio.pause()
  } else {
    // Mover o audio para onde o scrubbing parou e então dar play
    audio.currentTime = percent * audio.duration
    if (!wasPaused) audio.play()
  }

  // Se está em scrubbing, buscar o código de handleTimelineUpdate
  handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect()
  // Entrega a posição x do cursor do mouse, relativo à timeline
  // o 0 é para que o cursor não ultrapasse o limite.
  // Rect.width é a posição mais a direita no elemento
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  //Math.floor((porcentagem * duração do audio)) entrega o valor do quão distante está a reprodução do audio
  //Determina a imagem de acordo com como ela foi configurada, 10 segundos
  timelineContainer.style.setProperty("--preview-position", percent)

  // Configurações do Scrubbing (vide início do script)
  if (isScrubbing) {
    // Previne destaque da imagem enquanto em scrubbing
    e.preventDefault()
    timelineContainer.style.setProperty("--progress-position", percent)
  }
}

// Tempo atual
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatDuration(audio.currentTime)
  // Barra se move com a reprodução do audio
  const percent = audio.currentTime / audio.duration
  timelineContainer.style.setProperty("--progress-position", percent)
})

// Duração
audio.addEventListener("loadeddata", () => {
  totalTime.textContent = formatDuration(audio.duration)
})

// Converte tempo em :04 em vez de :4
const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
})

// Mostra duração completa do audio em vez dos segundos apenas
function formatDuration(time) {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60) % 60
  const hours = Math.floor(time / 3600)
  // Se não mostrar horas, mostrar somente os minutos, se mostra, exibir horas com os minutos
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

