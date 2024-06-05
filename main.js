/// CONSTANTS

const msToShowSongInfo = 5000;
const msToShowIntermission = 8000;
const msVideoFade = 2000;
const msFlierSlide = 2000;

const karaokeLyricsColors = ["#7a54b1", "#ff0000", "#ffff00", "#000"];
const chooseRandomLyricsColors = false;

const videoFiles = shuffle([
  "videos/market.mp4",
  ...Array.from({ length: 34 }, (_, i) => `videos/video_${i + 1}.mp4`),
]);

const songs = [
  "json/01_movement.json",
  "json/02_see-you-again.json",
  "json/03_discipline.json",
  "json/04_successful.json",
  "json/05_dont-stop-me-now.json",
  "json/06_lose-control.json",
  "json/07_creep.json",
  "json/08_fml.json",
  "json/09_feel-no-pain.json",
  "json/10_fuck-tha-police.json",
  "json/11_mockingbird.json",
  "json/12_love-the-way-you-lie.json",
  "json/13_yummy.json",
  "json/14_saturday-nights-alright-for-fighting.json",
  "json/15_power.json",
  "json/16_sunflower.json",
  "json/17_hips-dont-lie.json",
  "json/18_mobile.json",
  "json/19_numb.json",
  "json/20_mr-brightside.json",
];

const wendyKeywords = [
  "purity",
  "rigidity",
  "discipline",
  "authority",
  "control",
  "precision",
  "restraint",
  "strive",
];

/// SETUP

const startButton = document.getElementById("startButton");
const wendyAudioEl = document.getElementById("wendyTrackAudio");
const videoEls = [
  {
    bg: document.getElementById("video1Bg"),
    fg: document.getElementById("video1Fg"),
  },
  {
    bg: document.getElementById("video2Bg"),
    fg: document.getElementById("video2Fg"),
  },
];
const songInfoEl = document.getElementById("songInfo");
const songTitleEl = document.getElementById("songTitle");
const songArtistEl = document.getElementById("songArtist");
const lyricsWrapperEl = document.getElementById("lyricsWrapper");
const lyricsEl = document.getElementById("lyrics");
const intermissionBg = document.getElementById("intermission-bg");
const flierEl = document.getElementById("flier-image");

startButton.onclick = start;

let songsData = [];
Promise.all(songs.map((song) => fetch(song).then((res) => res.json()))).then(
  (d) => {
    songsData = d;
    console.log("loaded song lyrics", songsData);
    hydrateSongInfo(songsData[0]);
  }
);

const videoMetadataMap = {};

let hasStarted = false;
let currentVideoIndex = 0;
let currentVideoElIndex = 0;
let currentSongIndex = 0;

async function start() {
  if (hasStarted) return;
  hasStarted = true;
  startButton.style.display = "none";

  playVideoLoop();

  await animateIntermissionOut();
  songInfoEl.classList.remove("hidden");

  playSongLoop();
}

/// SONGS

async function playSongLoop() {
  playNextSong();

  async function playNextSong() {
    const song = songsData[currentSongIndex];
    await playSong(song);
    currentSongIndex = (currentSongIndex + 1) % songsData.length;
    await animateIntermission();
    playNextSong();
  }
}

async function playSong(song) {
  // start by showing song info (title, artist)
  showSongInfo(song, true);

  // set up the karaoke lyrics
  const initialDelay = song.scripts[0].start;
  console.log("starting to play", song.ti, "with initial delay", initialDelay);
  await delaySeconds(song.scripts[0].start, initialDelay);

  for (const line of song.scripts) {
    const { start, text, end } = line;
    const duration = end - start;

    lyricsEl.parentNode.removeChild(lyricsEl);

    lyricsEl.style.fontSize = getLyricsFontSize(text);

    const words = text.split(" ");
    const spans = words.map((word) => {
      const isKeyword = wendyKeywords.includes(word.toLowerCase());
      return isKeyword
        ? `<span class="wendy-keyword">${word}</span>`
        : `<span>${word}</span>`;
    });
    lyricsEl.innerHTML = spans.join(" ");

    lyricsEl.setAttribute("data-text", text);

    lyricsEl.style.setProperty("--karaoke-line-duration", `${duration}s`);

    if (chooseRandomLyricsColors) {
      document.documentElement.style.setProperty(
        "--karaoke-lyrics-color",
        choice(karaokeLyricsColors)
      );
    }

    lyricsWrapperEl.appendChild(lyricsEl);
    await delaySeconds(duration);
  }
}

// shows the song title and artist for a few seconds
async function showSongInfo(song) {
  hydrateSongInfo(song);

  songInfoEl.classList.add("large");
  await delay(msToShowSongInfo - 500);
  songInfoEl.classList.remove("large");
}

function hydrateSongInfo(song) {
  const { ti: title, ar: artist } = song;
  songTitleEl.textContent = title;
  songArtistEl.textContent = artist;
}

function getLyricsFontSize(text) {
  const numChars = text.length;
  if (numChars > 30) return "6rem";
  if (numChars > 20) return "8rem";
  if (numChars > 12) return "10rem";
  return "12rem";
}

/// Intermission

async function animateIntermission() {
  animateIntermissionIn();
  await delay(msToShowIntermission - 2000);
  await animateIntermissionOut();
}

async function animateIntermissionIn() {
  const slideInAnimations = [
    "slideInFromLeft",
    "slideInFromRight",
    "slideInFromTop",
    "slideInFromBottom",
  ];
  const idleAnimations = ["pulse", "bounce", "spin", "shake"];
  const slideAnim = choice(slideInAnimations);

  flierEl.style.display = "none";
  intermissionBg.style.opacity = 1;
  intermissionBg.style.display = "block";
  intermissionBg.style.animation = `fadeIn 0.7s ease, ${slideAnim} 1s ease`;
  await delay(500);

  flierEl.style.display = "block";
  flierEl.style.animation = `${slideAnim} ${msFlierSlide}ms ease`;
  await delay(msFlierSlide);

  flierEl.style.animation = `${choice(idleAnimations)} ${randomInt(
    1000,
    4000
  )}ms ease infinite`;
}

async function animateIntermissionOut() {
  const slideOutAnimations = [
    "slideOutToRight",
    "slideOutToLeft",
    "slideOutToTop",
    "slideOutToBottom",
  ];
  const slideAnim = choice(slideOutAnimations);

  flierEl.style.animation = `${slideAnim} 2s ease`;
  setTimeout(() => {
    intermissionBg.style.opacity = 0;
    intermissionBg.style.animation = `fadeOut 0.7s ease, ${slideAnim} 1s ease`;
  }, 500);

  await delay(msFlierSlide);
  flierEl.style.display = "none";
}

/// VIDEO

function playVideoLoop() {
  // intialize the video elements
  videoEls.forEach(({ bg, fg }) => {
    bg.muted = true;
    fg.muted = true;
    bg.style.opacity = 0;
    fg.style.opacity = 0;
  });
  loadVideoOntoElement(videoEls[0].bg, videoFiles[0]);
  loadVideoOntoElement(videoEls[0].fg, videoFiles[0]);

  playNextVideo();

  async function playNextVideo() {
    // choose video file, start playing it, fade in the video
    const videoFile = videoFiles[currentVideoIndex];
    const { bg: bgVideoEl, fg: fgVideoEl } = videoEls[currentVideoElIndex];
    const curEls = [bgVideoEl, fgVideoEl];
    curEls.forEach(fadeInVideo);
    await playVideo(bgVideoEl, fgVideoEl, videoFile);

    // don't load the next video until we are done fading out the current video
    await delay(msVideoFade);

    // figure out what our next video file will be
    if (currentVideoIndex < videoFiles.length - 1) {
      currentVideoIndex++;
    } else {
      currentVideoIndex = 0;
      shuffle(videoFiles);
    }

    // figure out what next video will be and load it onto the Alternate Elements
    const nextVideoFile = videoFiles[currentVideoIndex];
    currentVideoElIndex = (currentVideoElIndex + 1) % videoEls.length;
    const { bg: nextBgVideoEl, fg: nextFgVideoEl } =
      videoEls[currentVideoElIndex];
    const nextEls = [nextBgVideoEl, nextFgVideoEl];
    nextEls.forEach((el) => loadVideoOntoElement(el, nextVideoFile));

    // delay until it is time to fade out
    const durationMs = videoMetadataMap[videoFile].duration * 1000;
    await delay(durationMs - msVideoFade * 2);

    // fade out the current video
    curEls.forEach(fadeOutVideo);

    // play the next video, which will be faded in
    playNextVideo();
  }
}

function loadVideoOntoElement(videoEl, videoFile) {
  console.log("loading video onto element", videoFile);
  videoEl.pause();
  videoEl.src = videoFile;
  videoEl.currentTime = 0;

  videoEl.onloadedmetadata = function () {
    if (!videoMetadataMap[videoFile]) {
      videoMetadataMap[videoFile] = {
        width: this.videoWidth,
        height: this.videoHeight,
        duration: videoEl.duration,
        isVertical: this.videoHeight > this.videoWidth,
      };
      console.log("vid metadata", videoFile, videoMetadataMap[videoFile]);
    }
  };
}

// we do a nice vertical video overlaid onto bg cover-fit of same video effect :)
async function playVideo(bgVideoEl, fgVideoEl, videoFile) {
  await waitForVideoMetadata(videoFile);
  const { duration, isVertical } = videoMetadataMap[videoFile];

  if (isVertical) {
    fgVideoEl.classList.add("vertical");
  } else {
    fgVideoEl.classList.remove("vertical");
  }

  console.log("ok playing video", videoFile, duration);
  bgVideoEl.play();
  fgVideoEl.play();
}

/// UTILS

function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(items) {
  return items.sort(() => Math.random() - 0.5);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function delayFromTotal(totalMs, delayMs) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(totalMs - delayMs), delayMs)
  );
}

function delaySeconds(s) {
  return delay(s * 1000);
}

function fadeInAudio(audioEl) {
  const step = 0.02;
  const interval = 50;
  audioEl.volume = 0;
  const fadeInInterval = setInterval(() => {
    if (audioEl.volume < 1) audioEl.volume += step;
    else clearInterval(fadeInInterval);
  }, interval);
}

function fadeOutAudio(audioEl) {
  const step = 0.02;
  const interval = 50;
  audioEl.volume = 1;
  const fadeOutInterval = setInterval(() => {
    if (audioEl.volume > 0) audioEl.volume -= step;
    else clearInterval(fadeOutInterval);
  }, interval);
}

async function fadeInVideo(videoEl) {
  videoEl.style.opacity = 1;
  videoEl.style.animation = `fadeIn ${msVideoFade}ms`;
  await delay(msVideoFade);
}

async function fadeOutVideo(videoEl) {
  videoEl.style.opacity = 0;
  videoEl.style.animation = `fadeOut ${msVideoFade}ms`;
  await delay(msVideoFade);
}

async function waitForVideoMetadata(videoFile) {
  while (!videoMetadataMap[videoFile]) {
    await delay(30);
  }
}
