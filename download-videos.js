const util = require("util");
const exec = util.promisify(require("child_process").exec);

const videoUrls = [
  {
    title: "Movement - LCD soundsystem",
    karaokeUrl: "https://www.youtube.com/watch?v=YFf2iEoIRSU",
    audioUrl: "https://www.youtube.com/watch?v=TT2izWpGDCo",
  },
  {
    title: "See you again - Tyler the creator",
    karaokeUrl: "https://www.youtube.com/watch?v=V0vl8XIHjeE",
    audioUrl: "https://www.youtube.com/watch?v=TGgcC5xg9YI",
  },
  {
    title: "Discipline - Janet Jackson",
    audioUrl: "https://www.youtube.com/watch?v=L9J24AV9P5s",
  },
  {
    title: "Successful - Drake",
    audioUrl: "https://www.youtube.com/watch?v=j5DySYu5Bfw",
  },
  {
    title: "Dont Stop Me now - Queen",
    karaokeUrl: "https://www.youtube.com/watch?v=G962z-4OL9E",
    audioUrl: "https://www.youtube.com/watch?v=HgzGwKwLmgM",
  },
  {
    title: "Lose Control - Missy Elliott",
    karaokeUrl: "https://www.youtube.com/watch?v=nlMtKC55wLs",
    audioUrl: "https://www.youtube.com/watch?v=na7lIb09898",
  },
  {
    title: "Creep - Radiohead",
    karaokeUrl: "https://www.youtube.com/watch?v=3WLy3AblvmQ",
    audioUrl: "https://www.youtube.com/watch?v=XFkzRNyygfk",
  },
  {
    title: "FML - Kanye West",
    audioUrl: "https://www.youtube.com/watch?v=ZvtEQ0Vm56s",
  },
  {
    title: "Feel No Pain - Sade",
    audioUrl: "https://www.youtube.com/watch?v=yoLoEw8D0Bg",
  },
  {
    title: "Fuck the Police - NWA",
    karaokeUrl: "https://www.youtube.com/watch?v=Dir43ur7Jm0",
    audioUrl: "https://www.youtube.com/watch?v=fF3aPT7C51Y",
  },
  {
    title: "Mockingbird - Eminem",
    karaokeUrl: "https://www.youtube.com/watch?v=HAYuls3af5s",
    audioUrl: "https://www.youtube.com/watch?v=S9bCLPwzSC0",
  },
  {
    title: "Love the way you lie - Eminem",
    karaokeUrl: "https://www.youtube.com/watch?v=2jRN-XRsVwk",
    audioUrl: "https://www.youtube.com/watch?v=uelHwf8o7_U",
  },
  {
    title: "Yummy - Justin Bieber",
    karaokeUrl: "https://www.youtube.com/watch?v=NxQYcM0Kw2Q",
    audioUrl: "https://www.youtube.com/watch?v=8EJ3zbKTWQ8",
  },
  {
    title: "Saturdays all right for fighting - Elton John",
    karaokeUrl: "https://www.youtube.com/watch?v=gf98aK0g4nQ",
    audioUrl: "https://www.youtube.com/watch?v=AhnZEmnuzgM",
  },
  {
    title: "Power - Kanye West",
    karaokeUrl: "https://www.youtube.com/watch?v=lBR-AF8GFzQ",
    audioUrl: "https://www.youtube.com/watch?v=L53gjP-TtGE",
  },
  {
    title: "Sunflower - Post Malone",
    karaokeUrl: "https://www.youtube.com/watch?v=awxvtj-0JKw",
    audioUrl: "https://www.youtube.com/watch?v=ApXoWvfEYVU",
  },
  {
    title: "Hips dont lie - Shakira",
    karaokeUrl: "https://www.youtube.com/watch?v=3rtSq7K7KtI",
    audioUrl: "https://www.youtube.com/watch?v=DUT5rEU6pqM",
  },
  {
    title: "Mobile - Avril Lavigne",
    karaokeUrl: "https://www.youtube.com/watch?v=PnG9G3Phjv8",
    audioUrl: "https://www.youtube.com/watch?v=KuuhcltChKc",
  },
  {
    title: "Numb - Linkin Park",
    karaokeUrl: "https://www.youtube.com/watch?v=ZA0IsQK1jGM",
    audioUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
  },
  {
    title: "Mr Brightside - The Killers",
    karaokeUrl: "https://www.youtube.com/watch?v=c1X3Lg7RVkk",
    audioUrl: "https://www.youtube.com/watch?v=gGdGFtwCNBE",
  },
];

async function main() {
  for (let i = 0; i < videoUrls.length; i++) {
    const { title, karaokeUrl, audioUrl } = videoUrls[i];
    const cleanTitle = title.replace(" - ", "__").replace(/ /g, "_");
    const titleNumber = i + 1 < 10 ? `0${i + 1}` : i + 1;
    console.log("Downloading videos for", title);
    await Promise.all([
      // https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#format-selection-examples

      // downlaod the best mp4 video available with audio
      karaokeUrl &&
        downloadAndConvertVideo(karaokeUrl, titleNumber, cleanTitle),

      // download the best m4a audio available, or the best audio available if no m4a audio is available
      // audioUrl &&
      //   exec(
      //     `yt-dlp -f "ba[ext=m4a]/ba" "${audioUrl}" -o "youtube-videos/${titleNumber}_${cleanTitle}_audio.%(ext)s"`
      //   ).catch((e) => console.error(e)),
    ]);
  }
}

async function downloadAndConvertVideo(videoUrl, titleNumber, cleanTitle) {
  try {
    await exec(
      `yt-dlp -f "b[ext=mp4]" "${videoUrl}" -o "youtube-videos/${titleNumber}_${cleanTitle}_karaoke_dirty.mp4"`
    );
    await exec(
      `ffmpeg -i youtube-videos/${titleNumber}_${cleanTitle}_karaoke_dirty.mp4 -vcodec libx264 -acodec aac youtube-videos/${titleNumber}_${cleanTitle}_karaoke.mp4`
    );
    await exec(
      `rm youtube-videos/${titleNumber}_${cleanTitle}_karaoke_dirty.mp4`
    );
  } catch (err) {
    console.error(err);
  }
}

main();
