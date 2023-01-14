const widgetContainer = document.getElementById('widget');
const playButton = document.getElementById('play');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const audio = document.getElementById('audio');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const title = document.getElementById('title');
const author = document.getElementById('author');
const fullTime = document.getElementById('full-time');
const timeLeft = document.getElementById('time-left');
const widgetButton = document.getElementById('widget-button');

widgetButton.addEventListener("click", () => {
  const widgetClassList = widgetContainer.classList.value;

  if (!widgetClassList.includes('medium') && !widgetClassList.includes('small')) {
    widgetContainer.classList.add('medium');
  } else if (widgetClassList.includes('medium')) {
    widgetContainer.classList.replace('medium', 'small')
  } else {
    widgetContainer.classList.remove('medium', 'small');
  }
});

const songs = [
  {
    title: "Coffee",
    author: "Ann Paris",
  },
  {
    title: "Wild Hearts Prevail",
    author: "Steven Beddall",
  },
  {
    title: "Synergy",
    author: "TURPAK",
  },
];

audio.volume = 0.2;

let songIndex = 0;

loadSong(songs[songIndex]);

function loadSong(song) {
  title.innerText = song.title;
  author.innerText = song.author;
  audio.src = `assets/songs/${song.author}-${song.title}.mp3`;
  fullTime.innerText = '0:00';
  timeLeft.innerText = '0:00';

  setTimeout(() => {
    setTime();
  }, 500)
}

function setTime() {
  const { seconds, minutes } = formatTime(audio.duration);

  fullTime.innerText = `${minutes}:${seconds}`;
  timeLeft.innerText = `${minutes}:${seconds}`;
}

function formatTime(time) {
  let seconds = parseInt(time % 60);
  let minutes = parseInt((time/60) % 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return {seconds, minutes};
}

playButton.addEventListener("click", () => {
  const isPlaying = playButton.querySelector('i.fa-solid').classList.contains('fa-pause');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
})

function playSong() {
  playButton.querySelector('i.fa-solid').classList.remove('fa-play');
  playButton.querySelector('i.fa-solid').classList.add('fa-pause');

  audio.play();
  audio.addEventListener("timeupdate", updateProgress);
}

function pauseSong() {
  playButton.querySelector('i.fa-solid').classList.add('fa-play');
  playButton.querySelector('i.fa-solid').classList.remove('fa-pause');

  audio.pause();
} 

prevButton.addEventListener("click", prevSong);
nextButton.addEventListener("click", nextSong);

function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length -1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

function updateProgress(event) {
  const { duration, currentTime } = event.srcElement;
  const progressPercent = (currentTime/duration) * 100;
  const { seconds, minutes } = formatTime(duration - currentTime);

  progress.style.width = `${progressPercent}%`;
  timeLeft.innerText = Number.isNaN(audio.duration) ? '0:00' : `${minutes}:${seconds}`;
}

progressBar.addEventListener("click", setProgress);

function setProgress(event) {
  const width = this.clientWidth;
  const clickX = event.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX/width) * duration;
}

audio.addEventListener('ended', nextSong);