const { execSync } = require("child_process");

const files = [
  "2dd8f5e8-8409-4714-9e23-a4a2f87e56c8.mp4",
  "RPReplay_Final1716458861.mp4",
  "RPReplay_Final1686031058.mp4",
  "RPReplay_Final1685197299.mp4",
  "IMG_8756.MOV",
  "IMG_8073.MOV",
  "IMG_3656.MOV",
  "IMG_1757.MOV",
  "IMG_1257.MOV",
  "IMG_0251.MOV",
  "e2eea675d4134871a2785ecb37cc263c.MOV",
  "Copy_of_MVI_3289.MOV",
  "Copy_of_MVI_3255.MOV",
  "Copy_of_MVI_3251.MOV",
  "Copy_of_MVI_3249.MOV",
  "Copy_of_MVI_3246.MOV",
  "Copy_of_MVI_3238.MOV",
  "Copy_of_MVI_3219.MOV",
  "Copy_of_MVI_3166.MOV",
  "Copy_of_MVI_3165.MOV",
  "Copy_of_MVI_3157.MOV",
  "Copy_of_MVI_2989.MOV",
  "Copy_of_MVI_2880.MOV",
  "Copy_of_mock_sharks_fin.MOV",
  "Copy_of_IMG_9581.MOV",
  "Copy_of_IMG_5198.MOV",
  "bdc3a0cc-67b2-400e-ab0a-850a4802d00e.mp4",
  "b597d0c6542b472eafb1165934dac8cb.MOV",
  "af4f689a730145bc9608f26fa9778aa1.MOV",
  "aa10312f10c74e08a10d5276ca7a5e1c.MOV",
  "905318f5f7e04384b71bcb8e0b57e7ff.MOV",
  "8dc92e7b42904b66b4a85dd1a4d6fc26.MOV",
  "4bcf3902-6e79-4c17-a651-7f0d6756151b.mp4",
  "4a4107f3-79dd-42c8-9fd6-10cfa42257ea.mp4",
];

function main() {
  files.forEach((file, idx) => {
    const fileName = `video_${idx + 1}.mp4`;
    const command = `ffmpeg -i videos/${file} -vcodec libx264 -acodec aac videos/${fileName}`;
    execSync(command);
  });
}

main();
