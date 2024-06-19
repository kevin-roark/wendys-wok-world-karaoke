/// CONSTANTS

const msToShowSongInfo = 15000;
const msToShowIntermission = 30000;
const msVideoFade = 500;
const msFlierSlide = 2000;
const msVideoFilterTransition = 10000;

// const verticalVideoChoices = ['foreground', 'tile', 'center', 'bgEffect'];
const verticalVideoChoices = ["tile", "fit", "bgEffect"];
// const horizontalVideoChoices = ['fill', 'foreground', 'tile', 'fit'];
const horizontalVideoChoices = ["fill"];
const allChoices = [...verticalVideoChoices, ...horizontalVideoChoices];
const hasFg = allChoices.includes("foreground");
const hasBgEffect = allChoices.includes("bgEffect");
const horizontalTileWidth = 2048;
const verticalTileHeight = 1366;

const blurFilter = true;
const blurFilterOps = { min: 0, max: 4 };

const saturationFilter = true;
const saturationFilterOps = {
  minorProb: 0.8,
  maxMinor: 200,
  maxMajor: 400,
};

const sepiaFilter = true;
const sepiaFilterOps = {
  minorProb: 0.8,
  maxMinor: 15,
  maxMajor: 30,
};

const hueFilter = true;
const hueFilterOps = {
  minorProb: 0.85,
  minorMag: 3,
  majorMag: 8,
};

const noiseDisplacementFilter = true;
const noiseDisplacementOps = {
  xBase: 0.001,
  xMag: 0.002,
  yBase: 0.05,
  yMag: 0.15,
  scaleBase: 5,
  minorScaleProb: 0.9,
  minorScaleMag: 5,
  majorScaleMag: 20,
};

const colorMatrixFilter = false;

const videoFiles = shuffle([
  ...Array.from({ length: 34 }, (_, i) => `videos/video_${i + 1}.mp4`),
  // "videos/video_1.mp4",
  // "videos/video_3.mp4",
  // "videos/video_26.mp4",
]);

const songs = [
  // "json/01_movement.json",
  // "json/02_see-you-again.json",
  // "json/03_discipline.json",
  // "json/04_successful.json",
  // "json/05_dont-stop-me-now.json",
  // "json/06_lose-control.json",
  // "json/07_creep.json",
  // "json/08_fml.json",
  // "json/09_feel-no-pain.json",
  // "json/10_fuck-tha-police.json",
  // "json/11_mockingbird.json",
  // "json/12_love-the-way-you-lie.json",
  // "json/13_yummy.json",
  // "json/14_saturday-nights-alright-for-fighting.json",
  // "json/15_power.json",
  // "json/16_sunflower.json",
  "json/17_hips-dont-lie.json",
  // "json/18_mobile.json",
  // "json/19_numb.json",
  // "json/20_mr-brightside.json",
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

const wendyAudioEl = document.getElementById("wendyTrackAudio");
const videoEls = [
  {
    container: document.getElementById("video1Container"),
    bgEffect: document.getElementById("video1BgEffect"),
    bg: document.getElementById("video1Bg"),
    fg: document.getElementById("video1Fg"),
    canvas: document.getElementById("video1Canvas"),
  },
  {
    container: document.getElementById("video2Container"),
    bgEffect: document.getElementById("video2BgEffect"),
    bg: document.getElementById("video2Bg"),
    fg: document.getElementById("video2Fg"),
    canvas: document.getElementById("video2Canvas"),
  },
];
const songInfoEl = document.getElementById("songInfo");
const songTitleEl = document.getElementById("songTitle");
const songArtistEl = document.getElementById("songArtist");
const lyricsEl = document.getElementById("lyrics");
const intermissionBg = document.getElementById("intermission-bg");
const flierEl = document.getElementById("flier-image");
const videoOverlay = document.getElementById("video-overlay");
const noiseGrainEl = document.getElementById("noise-grain");

document.onclick = start;
setupFilterNoiseTurbulenceAnimation();
flierEl.style.animation = "pulse 2s infinite ease";

// setup video elements
videoEls.forEach(({ bgEffect, bg, fg }) => {
  setupVideoLoop(bg);
  if (hasBgEffect) {
    setupVideoLoop(bgEffect);
    // https://motionarray.com/stock-video/burning-film-frame-1393401/
    bgEffect.src = "videos/video_burning_film_frame_h264.mp4";
  }
  if (hasFg) {
    setupVideoLoop(fg);
  }

  function setupVideoLoop(videoEl) {
    videoEl.loop = true;
    videoEl.onended = () => {
      videoEl.currentTime = 0;
      videoEl.play();
    };
  }
});

// load songs json
let songsData = [];
Promise.all(songs.map((song) => fetch(song).then((res) => res.json()))).then(
  (d) => {
    songsData = d;
    console.log("loaded song lyrics", songsData);
    hydrateSongInfo(songsData[0]);
  }
);

const videoMetadataMap = {};
const videoElActiveVideoFileMap = {};

let hasStarted = false;
let currentVideoIndex = 0;
let currentVideoElIndex = 0;
let currentSongIndex = 0;

async function start() {
  if (hasStarted) return;
  hasStarted = true;

  if (hasBgEffect) {
    videoEls.forEach(({ bgEffect }) => bgEffect.play());
  }

  playVideoLoop();

  await animateIntermissionOut();
  songInfoEl.classList.remove("hidden");

  playSongLoop();
}

/// RESIZE

function onResize() {
  videoEls.forEach(({ canvas }) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

window.addEventListener("resize", onResize);
onResize();

/// SONGS

async function playSongLoop() {
  playNextSong();

  async function playNextSong() {
    const song = songsData[currentSongIndex];
    console.log("playing song", song.ti);
    await playSong(song);
    console.log("done playing song", song.ti);
    currentSongIndex = (currentSongIndex + 1) % songsData.length;
    console.log("next song", songsData[currentSongIndex].ti);
    await animateIntermission();
    playNextSong();
  }
}

async function playSong(song) {
  // start by showing song info (title, artist)
  songInfoEl.style.opacity = 1;
  await showSongInfo(song);

  // set up the karaoke lyrics
  // const initialDelay = song.scripts[0].start;
  console.log("starting to play", song.ti);
  // await delaySeconds(initialDelay);

  // setup animation for each line of song
  // let currentDelay = initialDelay;
  for (let lineIndex = 0; lineIndex < song.scripts.length; lineIndex++) {
    const line = song.scripts[lineIndex];
    const { start, text, end } = line;
    const duration = end - start;

    setTimeout(() => {
      lyricsEl.innerHTML = "";
      lyricsEl.style.fontSize = getLyricsFontSize(text);
      lyricsEl.style.opacity = 1;

      // create spans for each word in the line so that we can wrap them if necessary
      const words = text.split(" ");
      const spans = words.map((word) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.classList.add("lyrics-word");
        span.setAttribute("data-text", word);
        const isKeyword = wendyKeywords.includes(word.toLowerCase());
        if (isKeyword) span.classList.add("wendy-keyword");
        return span;
      });

      spans.forEach((span) => lyricsEl.appendChild(span));

      // setup animation for each word individually
      const spaceFreeText = text.replace(/ /g, "");
      let currentDelay = 0;
      for (let i = 0; i < words.length; i++) {
        const wordDuration =
          duration * (words[i].length / spaceFreeText.length);
        const span = spans[i];
        span.style.setProperty("--karaoke-line-duration", `${wordDuration}s`);
        setTimeout(() => span.classList.add("sung"), currentDelay * 1000 - 50);

        currentDelay += wordDuration * 0.95; // accumulate a little buffer at the end and go faster between words
      }

      // remove the final lyrics
      if (lineIndex === song.scripts.length - 1) {
        setTimeout(() => {
          lyricsEl.style.opacity = 0;
        }, currentDelay * 1000);
      }
    }, start * 1000);

    const nextLine =
      lineIndex < song.scripts.length - 1 && song.scripts[lineIndex + 1];
    if (nextLine && nextLine.start - end > 2) {
      setTimeout(() => {
        lyricsEl.innerHTML = "";
      }, (end + 1.5) * 1000);
    }

    // if prev line end is before this line start, delay the difference
    // const prevLine = lineIndex > 0 && song.scripts[lineIndex - 1];
    // if (prevLine && prevLine.end < start) {
    //   currentDelay += start - prevLine.end;
    //   // await delaySeconds(start - prevLine.end);
    // }

    // show the line, fully filled, for a brief moment
    // if (duration > endOfLineBuffer) {
    //   // await delaySeconds(endOfLineBuffer);
    //   currentDelay += endOfLineBuffer;
    // }
  }

  // remove the final lyrics
  // lyricsEl.style.opacity = 0;

  // wait until the song is over
  const [songMinutes, songSeconds] = song.length.split(":").map(Number);
  const songDuration = songMinutes * 60 + songSeconds;
  // const durationAfterLastLine = song.scripts[song.scripts.length - 1].end;
  // const timeLeft = songDuration - durationAfterLastLine;
  // await delaySeconds(timeLeft);
  await delaySeconds(songDuration);

  // remove the song info
  songInfoEl.style.opacity = 0;
}

// shows the song title and artist for a few seconds
async function showSongInfo(song) {
  hydrateSongInfo(song);

  songInfoEl.classList.add("large");
  await delay(msToShowSongInfo - 500);
  songInfoEl.classList.remove("large");
  await delay(500);
}

function hydrateSongInfo(song) {
  const { ti: title, ar: artist } = song;
  songTitleEl.textContent = title;
  songArtistEl.textContent = artist;
}

function getLyricsFontSize(text) {
  const numChars = text.length;
  if (numChars > 50) return "5rem";
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
  intermissionBg.style.opacity = 1;
  intermissionBg.style.transform = "translate(0, 0)";
  await delay(300);

  flierEl.style.transform = "translate(0, 0)";
  await delay(msFlierSlide);

  const idleAnimations = ["pulse"];
  const idleAnim = choice(idleAnimations);
  const idleAnimTime = randomInt(1000, 4000);
  flierEl.style.animation = `${idleAnim} ${idleAnimTime}ms ease infinite`;
}

async function animateIntermissionOut() {
  const slideOutTransforms = [
    "translate(-250%, 0)",
    "translate(250%, 0)",
    "translate(0, -250%)",
    "translate(0, 250%)",
  ];
  const slideTransform = choice(slideOutTransforms);

  // next tick vibes
  flierEl.style.animation = "";
  setTimeout(() => {
    flierEl.style.transform = slideTransform;
  }, 30);

  setTimeout(() => {
    intermissionBg.style.opacity = 0;
    intermissionBg.style.transform = slideTransform;
  }, 300);

  await delay(msFlierSlide);
}

/// VIDEO

function playVideoLoop() {
  // intialize the video elements
  videoEls.forEach(({ container, bg, bgEffect, fg, canvas }) => {
    bg.muted = true;
    fg.muted = true;
    bgEffect.muted = true;
    bgEffect.style.display = "none";
    container.style.opacity = 0;
    setupVideoFilterAnimation(bg, canvas);
  });

  loadVideoOntoElement(videoEls[0].bg, videoFiles[0]);
  hasFg && loadVideoOntoElement(videoEls[0].fg, videoFiles[0]);

  playNextVideo();

  async function playNextVideo() {
    // choose video file, start playing it, fade in the video
    const videoFile = videoFiles[currentVideoIndex];
    const curEls = videoEls[currentVideoElIndex];
    const { container } = curEls;
    fadeInElement(container);
    await playVideo(curEls, videoFile);

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
    const nextVideoEls = [nextBgVideoEl, nextFgVideoEl];
    nextVideoEls.forEach((el) => loadVideoOntoElement(el, nextVideoFile));

    // delay until it is time to fade out
    const durationMs = videoMetadataMap[videoFile].duration * 1000;
    await delay(durationMs - msVideoFade * 2);

    // fade out the current video
    fadeOutElement(container);

    // play the next video, which will be faded in
    playNextVideo();
  }
}

function loadVideoOntoElement(videoEl, videoFile) {
  videoEl.pause();
  videoEl.src = videoFile;
  videoEl.currentTime = 0;
  videoEl.play();

  videoEl.onloadedmetadata = function () {
    if (!videoMetadataMap[videoFile]) {
      videoMetadataMap[videoFile] = {
        width: this.videoWidth,
        height: this.videoHeight,
        duration: videoEl.duration,
        isVertical: this.videoHeight > this.videoWidth,
      };
      // console.log("vid metadata", videoFile, videoMetadataMap[videoFile]);
    }
  };
}

function setupVideoTileCanvas(videoEl, canvas, videoFile) {
  const ctx = canvas.getContext("2d");

  function step() {
    // have to know when to quit...
    const active = videoElActiveVideoFileMap[videoEl.id] === videoFile;
    if (!active) {
      console.log("stopping video tile canvas for", videoFile);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // background :)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // calculate number of tiles required and draw the video onto the canvas X * Y times
    const metadata = videoMetadataMap[videoFile];
    const [mWidth, mHeight] = [metadata.width, metadata.height];
    const [vWidth, vHeight] = metadata.isVertical
      ? [(mWidth / mHeight) * verticalTileHeight, verticalTileHeight]
      : [horizontalTileWidth, (mHeight / mWidth) * horizontalTileWidth];

    const xTiles = Math.ceil(canvas.width / vWidth) || 1;
    const yTiles = Math.ceil(canvas.height / vHeight) || 1;
    for (let i = 0; i < xTiles; i++) {
      for (let j = 0; j < yTiles; j++) {
        ctx.drawImage(videoEl, i * vWidth, j * vHeight, vWidth, vHeight);
      }
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function setupVideoFilterAnimation(videoEl, canvasEl) {
  function step() {
    const blur = blurFilter
      ? randomInt(blurFilterOps.min, blurFilterOps.max)
      : 0;
    const saturation = saturationFilter
      ? Math.random() < saturationFilterOps.minorProb
        ? randomInt(100, saturationFilterOps.maxMinor)
        : randomInt(saturationFilterOps.maxMinor, saturationFilterOps.maxMajor)
      : 100;
    const sepia = sepiaFilter
      ? Math.random() < sepiaFilterOps.minorProb
        ? randomInt(1, sepiaFilterOps.maxMinor)
        : randomInt(sepiaFilterOps.maxMinor, sepiaFilterOps.maxMajor)
      : 0;
    const hue = hueFilter
      ? Math.random() < hueFilterOps.minorProb
        ? randomInt(-hueFilterOps.minorMag, hueFilterOps.minorMag)
        : randomInt(-hueFilterOps.majorMag, hueFilterOps.majorMag)
      : 0;
    const filter = `blur(${blur}px) saturate(${saturation}%) sepia(${sepia}%) hue-rotate(${hue}deg)`;
    videoEl.style.filter = filter;
    canvasEl.style.filter = filter;
    setTimeout(step, msVideoFilterTransition);
  }
  step();
}

function setupFilterNoiseTurbulenceAnimation() {
  const turb = document.querySelector("#noise-turbulence feTurbulence");
  const turbMap = document.querySelector("#noise-turbulence feDisplacementMap");
  const colorMatrix = document.querySelector(
    "#noise-color-matrix feColorMatrix"
  );

  let animCount = 0;
  let prev = { x: 0.01, y: 0.2, scale: 30, r: 1, g: 1, b: 1 };
  let params = getParams();
  function step() {
    let { x, y, scale, r, g, b, numSteps, stepIdx } = params;
    const p = stepIdx / numSteps;

    if (noiseDisplacementFilter) {
      const curX = prev.x + (x - prev.x) * p;
      const curY = prev.y + (y - prev.y) * p;
      const curScale = prev.scale + (scale - prev.scale) * p;
      turb.setAttribute("baseFrequency", `${curX} ${curY}`);
      turbMap.setAttribute("scale", Math.round(curScale));
    }

    if (colorMatrixFilter) {
      const curR = prev.r + (r - prev.r) * p;
      const curG = prev.g + (g - prev.g) * p;
      const curB = prev.b + (b - prev.b) * p;
      colorMatrix.setAttribute(
        "values",
        `${curR} 0 0 0 0  0 ${curG} 0 0 0  0 0 ${curB} 0 0  0 0 0 1 0`
      );
    }

    params.stepIdx += 1;
    if (params.stepIdx > numSteps) {
      prev = params;
      animCount += 1;
      params = getParams();
    }

    requestAnimationFrame(step);
  }

  step();

  function getParams() {
    let x =
      noiseDisplacementOps.xBase +
      (Math.random() - 0.5) * noiseDisplacementOps.xMag;
    let y =
      noiseDisplacementOps.yBase +
      (Math.random() - 0.5) * noiseDisplacementOps.yMag;
    let scale =
      noiseDisplacementOps.scaleBase +
      (Math.random() < noiseDisplacementOps.minorScaleProb
        ? (Math.random() - 0.5) * noiseDisplacementOps.minorScaleMag
        : Math.random() * noiseDisplacementOps.majorScaleMag);

    let r = 1,
      g = 1,
      b = 1,
      random = Math.random();
    if (random < 0.33) {
      g = 0.1 + Math.random() * 0.8;
      b = 0.1 + Math.random() * 0.8;
    } else if (random < 0.66) {
      r = 0.1 + Math.random() * 0.8;
      b = 0.1 + Math.random() * 0.8;
    } else {
      r = 0.1 + Math.random() * 0.8;
      g = 0.1 + Math.random() * 0.8;
    }

    let duration = Math.random() * 10000;
    let numSteps = duration / 30;
    let stepIdx = 0;
    return { x, y, scale, r, g, b, duration, numSteps, stepIdx };
  }
}

// we do a nice vertical video overlaid onto bg cover-fit of same video effect :)
async function playVideo(videoEls, videoFile) {
  const {
    bg: bgVideoEl,
    bgEffect: bgEffectVideoEl,
    fg: fgVideoEl,
    canvas: canvasEl,
  } = videoEls;
  await waitForVideoMetadata(videoFile);
  const { duration, isVertical } = videoMetadataMap[videoFile];

  videoElActiveVideoFileMap[bgVideoEl.id] = videoFile;
  videoElActiveVideoFileMap[fgVideoEl.id] = videoFile;

  const videoChoice = choice(
    isVertical ? verticalVideoChoices : horizontalVideoChoices
  );
  const shouldTile = videoChoice === "tile";
  const shouldShowForeground = videoChoice === "foreground";

  if (shouldTile) {
    setupVideoTileCanvas(bgVideoEl, canvasEl, videoFile);
  }

  const shouldFit = videoChoice === "fit" || videoChoice === "bgEffect";
  const shouldUseEffect = videoChoice === "bgEffect";
  const fitWithBgEffect = videoChoice === "bgEffect";
  bgVideoEl.style.objectFit = shouldFit ? "contain" : "cover";
  bgVideoEl.style.objectPosition = fitWithBgEffect ? "right" : "center";
  bgVideoEl.style.height = fitWithBgEffect ? "calc(100vh - 40px)" : "100vh";
  bgVideoEl.style.top = fitWithBgEffect ? "20px" : "0";
  bgEffectVideoEl.style.display = shouldUseEffect ? "block" : "none";

  console.log("ok playing video", videoFile, duration);
  bgVideoEl.play();

  if (shouldShowForeground) {
    fgVideoEl.style.display = "block";
    if (isVertical) {
      fgVideoEl.classList.add("vertical");
    } else {
      fgVideoEl.classList.remove("vertical");
    }

    fgVideoEl.play();
  } else {
    fgVideoEl.style.display = "none";
  }
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

async function fadeInElement(el) {
  el.style.opacity = 1;
  await delay(msVideoFade);
}

async function fadeOutElement(el) {
  el.style.opacity = 0;
  await delay(msVideoFade);
}

async function waitForVideoMetadata(videoFile) {
  while (!videoMetadataMap[videoFile]) {
    await delay(10);
  }
}
