import { generateFilesForContract } from "../shared/abi/generate-for-contract";
import { CONTRACTS, GENERATION_FOLDER } from "./contracts";
import { DEPLOYER_ADDRESS } from "../private-testnet";
import { NativeClarityBinProvider } from "@blockstack/clarity";
import { createDefaultTestProvider } from '../shared/default-test-provider';
import { contractWithSubDirectory } from "../shared/utils/contract-with-subdirectory";

async function generateAbiFilesForContract(
  contract: CONTRACTS,
  address: string,
  provider: NativeClarityBinProvider
) {

  await generateFilesForContract({
    contractFile: contractWithSubDirectory(contract),
    outputFolder: GENERATION_FOLDER,
    contractAddress: address,
    provider
  });
}

export async function generateAbis(): Promise<void> {

  const provider = await createDefaultTestProvider();

  // await deploy({
  //   contractFile: contractWithSubDirectory('sip-10-ft-standard'),
  //   contractAddress: DEPLOYER_ADDRESS,
  //   provider
  // });

  // await deploy({
  //   contractFile: contractWithSubDirectory('simple-counter'),
  //   contractAddress: DEPLOYER_ADDRESS,
  //   provider
  // });

  // await deploy({
  //   contractFile: contractWithSubDirectory('counter-coin'),
  //   contractAddress: DEPLOYER_ADDRESS,
  //   provider
  // });


  // await deploy({
  //   contractFile: contractWithSubDirectory('counter'),
  //   contractAddress: DEPLOYER_ADDRESS,
  //   provider
  // });

  await generateAbiFilesForContract("sip-10-ft-standard", DEPLOYER_ADDRESS, provider);
  await generateAbiFilesForContract("simple-counter", DEPLOYER_ADDRESS, provider);
  await generateAbiFilesForContract("counter-coin", DEPLOYER_ADDRESS, provider);
  await generateAbiFilesForContract("counter", DEPLOYER_ADDRESS, provider);
}
