import { dos2unix } from "dos2unix";
import { readFileSync } from "fs";
import { mkdir, writeFile } from "fs/promises";

export function convertDos2Unix(): Promise<void> {
  return new Promise((resolve, reject) => {
    var kkt = new dos2unix({
      glob: { cwd: "contracts" },
    });

    kkt
      .on("error", function (err) {
        console.error(err);
        reject(err);
      })
      .on("end", function (stats) {
        console.log(stats);
        resolve();
      });

    kkt.process(["*.clar"]);
  });
}

export function convertContractFile(contractName: string) {
  var filePath = contractFilePath(`${contractName}.clar`);
  var content = readFile(filePath);
  var unixContent = dos2unixContent(content);
  writeToFile(filePath, unixContent);
}

export function readFile(filePath: string): string {
  const file = readFileSync(filePath, "utf-8");

  return file;
}

export function writeToFile(filePath: string, content: string): void {
  writeFile(filePath, content, "utf-8");
}

export function contractFilePath(fileName: string): string {
  return `${process.cwd()}\\contracts\\${fileName}`;
}

export function dos2unixContent(str: string) {
  return str.replace(/\r\n/g, "\n");
}
