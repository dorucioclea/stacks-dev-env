import { convertContractFile } from "../dos2unix";
import { generateFilesForContract } from "../shared/abi/generate-for-contract";

const CONTRACT_EXTENSION = ".clar";

const GENERATION_FOLDER = "src//";

export type CONTRACTS = "counter";

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
  await generateAbiFilesForContract("counter", DEPLOYMENT_ADDRESS);
}
