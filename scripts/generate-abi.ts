import { convertContractFile } from "../dos2unix";
import { generateFilesForContract } from "../shared/abi/generate-for-contract";
import { CONTRACTS } from "./contracts";

const CONTRACT_EXTENSION = ".clar";

const GENERATION_FOLDER = "src//";

const DEPLOYMENT_ADDRESS: string = "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH";

function contractWithSubDirectory(contractName: string) {
  if (contractName.endsWith(CONTRACT_EXTENSION)) {
    return `contracts//${contractName}`;
  }

  return `contracts//${contractName}.clar`;
}

async function generateAbiFilesForContract(
  contract: CONTRACTS,
  address: string
) {
  await generateFilesForContract({
    contractFile: contractWithSubDirectory(contract),
    outputFolder: GENERATION_FOLDER,
    contractAddress: address,
  });
}

export async function generateAbis(): Promise<void> {
  await generateAbiFilesForContract("ft-trait", DEPLOYMENT_ADDRESS);
  await generateAbiFilesForContract("counter-coin", DEPLOYMENT_ADDRESS);
  await generateAbiFilesForContract("counter", DEPLOYMENT_ADDRESS);
}
