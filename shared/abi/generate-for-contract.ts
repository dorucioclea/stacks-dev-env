import {
  generateIndexFile,
  generateInterface,
  generateInterfaceFile,
  generateTypesFile,
} from "./files";
import { getContractNameFromPath } from "../util";
import { NativeClarityBinProvider } from "@blockstack/clarity";
import { resolve, relative, dirname } from "path";
import { mkdir, writeFile } from "fs/promises";

export const generateFilesForContract = async ({
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
}) => {


  console.log(process.cwd())

  const contractFile = resolve(process.cwd(), _contractFile);
  const contractName = getContractNameFromPath(contractFile);

  console.log('contract file', contractFile);
  console.log('contract name ', contractName);

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

  console.log('index filie ', indexFile);

  const abiFile = generateInterfaceFile({ contractFile, abi });

  const baseDir = outputFolder || resolve(process.cwd(), `tmp/${contractName}`);
  const outputPath = resolve(baseDir, dirName || ".", contractName);
  await mkdir(outputPath, { recursive: true });

  await writeFile(resolve(outputPath, "abi.ts"), abiFile);
  await writeFile(resolve(outputPath, "index.ts"), indexFile);
  await writeFile(resolve(outputPath, "types.ts"), typesFile);
};
