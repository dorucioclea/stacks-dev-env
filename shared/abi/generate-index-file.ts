import { getContractNameFromPath, toCamelCase } from "../util";

export function generateIndexFile({
  contractFile,
  address,
}: {
  contractFile: string;
  address: string;
}) {
  const contractName = getContractNameFromPath(contractFile);
  const contractTitle = toCamelCase(contractName, true);
  const varName = toCamelCase(contractName);
  const contractType = `${contractTitle}Contract`;

  const fileContents = `import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { ${contractType} } from './types';
import { ${contractTitle}Interface } from './abi';
export type { ${contractType} } from './types';
export const ${varName}Contract = (provider: BaseProvider) => {
  const contract = proxy<${contractType}>(${contractTitle}Interface, provider);
  return contract;
};
export const ${varName}Info: Contract<${contractType}> = {
  contract: ${varName}Contract,
  address: '${address}',
  contractFile: '${contractFile}',
};
`;

  return fileContents;
}
