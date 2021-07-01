import { NativeClarityBinProvider, Client } from "@blockstack/clarity";
import { getDefaultBinaryFilePath } from "@blockstack/clarity-native-bin";
import { getTempFilePath } from "@blockstack/clarity/lib/utils/fsUtil";

export async function deployContract(
  client: Client,
  provider?: NativeClarityBinProvider
) {

  const binFile = getDefaultBinaryFilePath();
  const dbFileName = getTempFilePath();
    
  const providerToUse = provider ||
  (await NativeClarityBinProvider.create([], dbFileName, binFile));

  console.log('deploying ', client.name, client.filePath, provider.dbFilePath);
  const receipt = await providerToUse.runCommand([
    "launch",
    client.name,
    client.filePath,
    provider.dbFilePath,
    "--costs",
    "--assets",
  ]);
  if (receipt.stderr) {

    console.log('deployment error ', receipt.stderr);

    throw new Error(`Error on ${client.filePath}:
  ${receipt.stderr}
    `);
  }

  console.log('deployment success: ', receipt.stdout);

  const output = JSON.parse(receipt.stdout);
  if (output.error) {
    const { initialization } = output.error;
    if (initialization?.includes("\nNear:\n")) {
      const [error, trace] = initialization.split("\nNear:\n");
      let startLine = "";
      const matcher = /start_line: (\d+),/;
      const matches = matcher.exec(trace);
      if (matches) startLine = matches[1];
      throw new Error(`Error on ${client.filePath}:
    ${error}
    ${startLine ? `Near line ${startLine}` : ""}
    Raw trace:
    ${trace}
      `);
    }
    throw new Error(`Error on ${client.filePath}:
  ${JSON.stringify(output.error, null, 2)}
    `);
  }
}
