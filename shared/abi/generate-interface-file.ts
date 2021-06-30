import { NativeClarityBinProvider } from "@blockstack/clarity";
import { getTempFilePath } from "@blockstack/clarity/lib/utils/fsUtil";
import { getDefaultBinaryFilePath } from "@blockstack/clarity-native-bin";

import { ClarityAbi } from "../clarity/types";
import { getContractNameFromPath } from "../utils/contract-name-for-path";
import { toCamelCase } from '../utils/to-camel-case';

export function generateInterfaceFile({
  contractFile,
  abi,
}: {
  contractFile: string;
  abi: ClarityAbi;
}) {
  const contractName = getContractNameFromPath(contractFile);
  const variableName = toCamelCase(contractName, true);
  const abiString = JSON.stringify(abi, null, 2);

  const fileContents = `import { ClarityAbi } from '@clarigen/core';
// prettier-ignore
export const ${variableName}Interface: ClarityAbi = ${abiString};
`;

  return fileContents;
}
