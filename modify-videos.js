const { execSync } = require("child_process");

function main() {
  // crop videos to remove the instagram bar and icons :)
  // const instagramVideos = [
  //   {
  //     file: "videos/video_2.mp4",
  //     crop: { x: 0, y: 330, width: 100, height: 816 },
  //   },
  //   {
  //     file: "videos/video_3.mp4",
  //     crop: { x: 0, y: 660, width: 0, height: 900 },
  //   },
  //   {
  //     file: "videos/video_11.mp4",
  //     crop: { x: 0, y: 0, width: 0, height: 160 },
  //   },
  //   {
  //     file: "videos/video_32.mp4",
  //     crop: { x: 0, y: 0, width: 100, height: 666 },
  //   },
  // ];
  // instagramVideos.forEach(({ file, crop }, idx) => {
  //   const fileName = `${file.replace(".mp4", "")}_cropped.mp4`;
  //   const command = `ffmpeg -y -i ${file} -filter:v "crop=in_w-${crop.width}:in_h-${crop.height}:${crop.x}:${crop.y}" ${fileName}`;
  //   execSync(command);
  // });
  // rotate videos 90deg
  // const videosToRotate = ["videos/video_15.mp4", "videos/video_22.mp4"];
  // videosToRotate.forEach((file, idx) => {
  //   const fileName = `${file.replace(".mp4", "")}_rotated.mp4`;
  //   const command = `ffmpeg -y -i ${file} -vf "transpose=2" ${fileName}`;
  //   execSync(command);
  // });
}

main();
