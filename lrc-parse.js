const lrcParser = require("lrc-parser");
const fs = require("fs");

const files = ["lrc/lose-control.lrc"];

function main() {
  for (const file of files) {
    const fileData = fs.readFileSync(file);
    const lrcData = lrcParser(fileData.toString("utf8"));
    const fileName = file.split("/")[1].split(".")[0];
    fs.writeFileSync(`json/${fileName}.json`, JSON.stringify(lrcData, null, 2));
  }
}

main();
