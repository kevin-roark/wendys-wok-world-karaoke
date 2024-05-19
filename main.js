const startButton = document.getElementById("startButton");
const videoEl = document.getElementById("video");
const lyricsEl = document.getElementById("lyrics");

let hasStarted = false;

startButton.onclick = start;

async function start() {
  if (hasStarted) return;
  hasStarted = true;
  startButton.style.display = "none";

  const videoFiles = ["videos/market.mp4"];
  const lyricFiles = ["json/lose-control.json"];

  videoEl.addEventListener("ended", function () {
    videoEl.currentTime = 0;
    startVideo(choice(videoFiles));
  });
  startVideo(videoFiles[0]);

  const lyricData = await Promise.all(
    lyricFiles.map(async (file) => {
      return fetch(file).then((res) => res.json());
    })
  );

  console.log("loaded lyric data", lyricData);
  playLyricData(lyricData[0]);
}

async function playLyricData(lyrics) {
  await delaySeconds(lyrics.scripts[0].start);

  for (const line of lyrics.scripts) {
    const { start, text, end } = line;
    const duration = end - start;
    lyricsEl.innerText = text;
    await delaySeconds(duration);
  }
}

function startVideo(videoFile) {
  videoEl.src = videoFile;
  videoEl.play();
}

function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function delaySeconds(s) {
  return delay(s * 1000);
}
