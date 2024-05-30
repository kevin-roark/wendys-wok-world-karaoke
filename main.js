const startButton = document.getElementById("startButton");
const videoEl = document.getElementById("video");
const lyricsWrapperEl = document.getElementById("lyricsWrapper");
const lyricsEl = document.getElementById("lyrics");

let hasStarted = false;

startButton.onclick = start;

async function start() {
  if (hasStarted) return;
  hasStarted = true;
  startButton.style.display = "none";

  const videoFiles = [
    "videos/market.mp4",
    ...Array.from({ length: 34 }, (_, i) => `videos/video_${i + 1}.mp4`),
  ];

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

    lyricsEl.parentNode.removeChild(lyricsEl);

    lyricsEl.style.fontSize = getFontSize(text);
    lyricsEl.innerText = text;
    lyricsEl.setAttribute("data-text", text);
    lyricsEl.style.setProperty("--karaoke-line-duration", `${duration}s`);

    lyricsWrapperEl.appendChild(lyricsEl);
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

function getFontSize(text) {
  const numChars = text.length;
  if (numChars > 30) return "3rem";
  if (numChars > 20) return "4rem";
  if (numChars > 12) return "6rem";
  return "8rem";
}
