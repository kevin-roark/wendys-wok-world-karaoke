const lrcParser = require("lrc-parser");
const fs = require("fs");

const files = [
  // "lrc/01_movement.lrc",
  // "lrc/02_see-you-again.lrc",
  // "lrc/03_discipline.lrc",
  // "lrc/04_successful.lrc",
  // "lrc/05_dont-stop-me-now.lrc",
  // "lrc/06_lose-control.lrc",
  // "lrc/07_creep.lrc",
  // "lrc/08_fml.lrc",
  // "lrc/09_feel-no-pain.lrc",
  // "lrc/10_fuck-tha-police.lrc",
  // "lrc/11_mockingbird.lrc",
  // "lrc/12_love-the-way-you-lie.lrc",
  // "lrc/13_yummy.lrc",
  // "lrc/14_saturday-nights-alright-for-fighting.lrc",
  // "lrc/15_power.lrc",
  // "lrc/16_sunflower.lrc",
  "lrc/17_hips-dont-lie.lrc",
  // "lrc/18_mobile.lrc",
  // "lrc/19_numb.lrc",
  // "lrc/20_mr-brightside.lrc",
];

function main() {
  for (const file of files) {
    const fileData = fs.readFileSync(file);
    const lrcData = lrcParser(fileData.toString("utf8"));
    const fileName = file.split("/")[1].split(".")[0];
    fs.writeFileSync(`json/${fileName}.json`, JSON.stringify(lrcData, null, 2));
  }
}

main();
