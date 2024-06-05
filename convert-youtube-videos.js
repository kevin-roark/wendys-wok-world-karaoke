const { execSync } = require("child_process");

const files = [
  "01_Movement__LCD_soundsystem_audio.m4a",
  "01_Movement__LCD_soundsystem_karaoke.mp4",
  "02_See_you_again__Tyler_the_creator_audio.m4a",
  "02_See_you_again__Tyler_the_creator_karaoke.mp4",
  "03_Discipline__Janet_Jackson_audio.m4a",
  "04_Successful__Drake_audio.m4a",
  "05_Dont_Stop_Me_now__Queen_audio.m4a",
  "05_Dont_Stop_Me_now__Queen_karaoke.mp4",
  "06_Lose_Control__Missy_Elliott_audio.m4a",
  "06_Lose_Control__Missy_Elliott_karaoke.mp4",
  "07_Creep__Radiohead_audio.m4a",
  "07_Creep__Radiohead_karaoke.mp4",
  "08_FML__Kanye_West_audio.m4a",
  "09_Feel_No_Pain__Sade_audio.m4a",
  "10_Fuck_the_Police__NWA_audio.m4a",
  "10_Fuck_the_Police__NWA_karaoke.mp4",
  "11_Mockingbird__Eminem_audio.m4a",
  "11_Mockingbird__Eminem_karaoke.mp4",
  "12_Love_the_way_you_lie__Eminem_audio.m4a",
  "12_Love_the_way_you_lie__Eminem_karaoke.mp4",
  "13_Yummy__Justin_Bieber_audio.m4a",
  "13_Yummy__Justin_Bieber_karaoke.mp4",
  "14_Saturdays_all_right_for_fighting__Elton_John_audio.m4a",
  "14_Saturdays_all_right_for_fighting__Elton_John_karaoke.mp4",
  "15_Power__Kanye_West_audio.m4a",
  "15_Power__Kanye_West_karaoke.mp4",
  "16_Sunflower__Post_Malone_audio.m4a",
  "16_Sunflower__Post_Malone_karaoke.mp4",
  "17_Hips_dont_lie__Shakira_audio.m4a",
  "17_Hips_dont_lie__Shakira_karaoke.mp4",
  "18_Mobile__Avril_Lavigne_audio.m4a",
  "18_Mobile__Avril_Lavigne_karaoke.mp4",
  "19_Numb__Linkin_Park_audio.m4a",
  "19_Numb__Linkin_Park_karaoke.mp4",
  "20_Mr_Brightside__The_Killers_audio.m4a",
  "20_Mr_Brightside__The_Killers_karaoke.mp4",
];

function main() {
  files.forEach((file, idx) => {
    const fileName = `h264',`;
    const command = `ffmpeg -i youtube-videos/${file} -vcodec libx264 -acodec aac videos/${fileName}`;
    execSync(command);
  });
}

main();
