import { NativeClarityBinProvider } from "@blockstack/clarity";
import { EvalErr, EvalResult } from "./types";

export async function evalJson({
  contractAddress,
  functionName,
  provider,
  args = [],
}: {
  contractAddress: string;
  functionName: string;
  provider: NativeClarityBinProvider;
  args?: string[];
}) {
  const evalCode = `(${functionName} ${args.join(" ")})`;
  const receipt = await provider.runCommand(
    ["eval_at_chaintip", "--costs", contractAddress, provider.dbFilePath],
    {
      stdin: evalCode,
    }
  );
  const response: EvalResult = JSON.parse(receipt.stdout);
  if (process.env.PRINT_CLARIGEN_STDERR && receipt.stderr) {
    console.log(receipt.stderr);
  }
  if (!response.success) {
    throw new Error(JSON.stringify((response as EvalErr).error, null, 2));
  }
  return response;
}
