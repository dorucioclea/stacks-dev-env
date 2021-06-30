import { NativeClarityBinProvider } from '@blockstack/clarity';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';

import { dirname, join } from 'path';
import { ClarityAbi } from '../clarity-types';
import { makeTypes } from './utils';
import { getContractNameFromPath, toCamelCase } from '../util';

export const generateInterface = async ({
  provider: _provider,
  contractFile,
  contractAddress = 'S1G2081040G2081040G2081040G208105NK8PE5',
}: {
  contractFile: string;
  provider?: NativeClarityBinProvider;
  contractAddress?: string;
}): Promise<ClarityAbi> => {

  console.log('inside generate interface')

  const binFile = getDefaultBinaryFilePath();


  console.log('binfile', binFile);

  const dbFileName = getTempFilePath();


  console.log('dbfilename', dbFileName);

  const provider =
    _provider ||
    (await NativeClarityBinProvider.create([], dbFileName, binFile));

    console.log('Created provider');

  const contractName = getContractNameFromPath(contractFile);
  
  console.log('contractname' , contractName);


  
  const receipt = await provider.runCommand([
    'launch',
    `${contractAddress}.${contractName}`,
    contractFile,
    provider.dbFilePath,
    '--output_analysis',
    '--costs',
    '--assets',
  ]);
  if (receipt.stderr) {
    throw new Error(`Error on ${contractFile}:
  ${receipt.stderr}
    `);
  }

  console.log('receipt', receipt.exitCode);

  console.log('stdout', receipt.stdout);

  const output = JSON.parse(receipt.stdout);
  if (output.error) {
    const { initialization } = output.error;
    if (initialization?.includes('\nNear:\n')) {
      const [error, trace] = initialization.split('\nNear:\n');
      let startLine = '';
      const matcher = /start_line: (\d+),/;
      const matches = matcher.exec(trace);
      if (matches) startLine = matches[1];
      throw new Error(`Error on ${contractFile}:
    ${error}
    ${startLine ? `Near line ${startLine}` : ''}
    Raw trace:
    ${trace}
      `);
    }
    throw new Error(`Error on ${contractFile}:
  ${JSON.stringify(output.error, null, 2)}
    `);
  }
  const abi = output.analysis;
  return abi;
};
  
export const generateInterfaceFile = ({
  contractFile,
  abi,
}: {
  contractFile: string;
  abi: ClarityAbi;
}) => {
  const contractName = getContractNameFromPath(contractFile);
  const variableName = toCamelCase(contractName, true);
  const abiString = JSON.stringify(abi, null, 2);

  const fileContents = `import { ClarityAbi } from '@clarigen/core';
// prettier-ignore
export const ${variableName}Interface: ClarityAbi = ${abiString};
`;

  return fileContents;
};

export const generateIndexFile = ({
  contractFile,
  address,
}: {
  contractFile: string;
  address: string;
}) => {
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
};

export const generateTypesFile = (abi: ClarityAbi, contractName: string) => {
  console.log('in generate types file');
  const name = toCamelCase(contractName, true);
  console.log('name ', name);
  const typings = makeTypes(abi);
  const fileContents = `import { ClarityTypes, Transaction } from '@clarigen/core';
// prettier-ignore
export interface ${name}Contract {
${typings}
}
`;

  return fileContents;
};
