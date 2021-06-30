import { getContractNameFromPath } from "../util";
import { NativeClarityBinProvider } from "@blockstack/clarity";
import { resolve, relative } from "path";
import { mkdir, writeFile } from "fs/promises";
import { generateTypesFile } from "./generate-type-file";
import { generateIndexFile } from "./generate-index-file";
import { generateInterfaceFile } from "./generate-interface-file";
import { generateInterface } from "./generate-interface";

export async function generateFilesForContract({
  contractFile: _contractFile,
  outputFolder,
  provider,
  contractAddress,
  dirName,
}: {
  contractFile: string;
  outputFolder?: string;
  provider?: NativeClarityBinProvider;
  contractAddress?: string;
  dirName?: string;
}) {
  const contractFile = resolve(process.cwd(), _contractFile);

  const contractName = getContractNameFromPath(contractFile);

  const abi = await generateInterface({
    contractFile,
    provider,
    contractAddress,
  });

  const typesFile = generateTypesFile(abi, contractName);
  if (!contractAddress && process.env.NODE_ENV !== "test") {
    console.warn("Please provide an address with every contract.");
  }

  const indexFile = generateIndexFile({
    contractFile: relative(process.cwd(), contractFile),
    address: contractAddress || "",
  });

  const abiFile = generateInterfaceFile({ contractFile, abi });

  const baseDir = outputFolder || resolve(process.cwd(), `tmp/${contractName}`);
  const outputPath = resolve(baseDir, dirName || ".", contractName);
  await mkdir(outputPath, { recursive: true });

  await writeFile(resolve(outputPath, "abi.ts"), abiFile);
  await writeFile(resolve(outputPath, "index.ts"), indexFile);
  await writeFile(resolve(outputPath, "types.ts"), typesFile);
}
