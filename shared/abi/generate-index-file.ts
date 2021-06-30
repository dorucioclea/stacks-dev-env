import { getContractNameFromPath } from "../utils/contract-name-for-path";
import { toCamelCase } from "../utils/to-camel-case";

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

  const fileContents = `import { Contract } from '../../shared/types';
import { proxy } from '../../shared/test-utils/proxy';
import { BaseProvider } from '../../shared/providers/base-provider';

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
