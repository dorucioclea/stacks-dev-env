import { Client, NativeClarityBinProvider } from "@blockstack/clarity";
import { getDefaultBinaryFilePath } from "@blockstack/clarity-native-bin";
import { getTempFilePath } from "@blockstack/clarity/lib/utils/fsUtil";
import { TestProvider } from "../providers/test-provider";
import { getContractNameFromPath } from "../utils/contract-name-for-path";
import { deployContract } from "./deploy-contract";

export async function deploy({
  provider,
  contractFile,
  contractAddress = "S1G2081040G2081040G2081040G208105NK8PE5",
}: {
  contractFile: string;
  contractAddress?: string;
  provider: NativeClarityBinProvider;
}) {
  let contractName = getContractNameFromPath(contractFile);

  const contractIdentifier = `${contractAddress}.${contractName}`;
  const client = new Client(contractIdentifier, contractFile, provider);
  await deployContract(client, provider);
}
