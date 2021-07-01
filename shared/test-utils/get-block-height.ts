import { NativeClarityBinProvider } from "@blockstack/clarity";
import { deserializeCV } from "@stacks/transactions";
import { evalJson } from "../adapter/eval-json";
import { cvToValue } from "../clarity/cv-to-value";
import { UTIL_CONTRACT_ID } from "./deploy-util-contract";

export async function getBlockHeight(provider: NativeClarityBinProvider) {
  const { output_serialized } = await evalJson({
    contractAddress: UTIL_CONTRACT_ID,
    functionName: "get-block-height",
    args: [],
    provider,
  });
  const outputCV = deserializeCV(Buffer.from(output_serialized, "hex"));
  const blockHeight: number = cvToValue(outputCV);
  return blockHeight;
}
