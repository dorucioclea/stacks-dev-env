import BN from "bn.js"
import { ClarityAbi, ClarityAbiType, ClarityValue, isClarityAbiBuffer, isClarityAbiList, isClarityAbiOptional, isClarityAbiPrimitive, isClarityAbiResponse, isClarityAbiStringAscii, isClarityAbiStringUtf8, isClarityAbiTuple, serializeCV } from '@stacks/transactions';
import { contractPrincipalCV } from '@stacks/transactions';
import { Allocation, Contract, EvalErr, EvalResult, ExecuteResult } from './types';
import { Client, NativeClarityBinProvider } from '@blockstack/clarity';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';

import { promises as fileSystemPath } from 'fs';

class HexUtils {
    public hex2bn(hex: string): BN {
        return new BN(hex);
    }

    public cv2Hex (clarityValue: ClarityValue): string {
        return `0x${serializeCV(clarityValue).toString('hex')}`;
    } 
}

export const toCamelCase = (input: string | number | symbol, titleCase?: boolean) => {
  const inputStr = typeof input === 'string' ? input : String(input);
  const [first, ...parts] = inputStr.replace('!', '').split('-');
  let result = titleCase ? `${first[0].toUpperCase()}${first.slice(1)}` : first;
  parts.forEach(part => {
    const capitalized = part[0].toUpperCase() + part.slice(1);
    result += capitalized;
  });
  return result;
};

export const getContractNameFromPath = (path: string) => {

  const contractPaths = path.normalize().split('\\');
  const filename = contractPaths[contractPaths.length - 1];
  const [contractName] = filename.split('.');
  return contractName;
};

export const getContractIdentifier = <T>(contract: Contract<T>) => {
  const contractName = getContractNameFromPath(contract.contractFile);
  return `${contract.address}.${contractName}`;
};

export const getContractPrincipalCV = <T>(contract: Contract<T>) => {
  const contractName = getContractNameFromPath(contract.contractFile);
  return contractPrincipalCV(contract.address, contractName);
};


  export const executeJson = async ({
    contractAddress,
    senderAddress,
    functionName,
    provider,
    args = [],
  }: {
    contractAddress: string;
    senderAddress: string;
    provider: NativeClarityBinProvider;
    functionName: string;
    args?: string[];
  }) => {
    const result = await provider.runCommand([
      'execute',
      '--costs',
      '--assets',
      provider.dbFilePath,
      contractAddress,
      functionName,
      senderAddress,
      ...args,
    ]);
    const response: ExecuteResult = JSON.parse(result.stdout);
    if (response && 'error' in response) {
      throw new Error(`Transaction error: ${JSON.stringify(response.error, null, 2)}`);
    }
    if (result.exitCode !== 0) {
      throw new Error(`Execution error: ${result.stderr}`);
    }
    return response;
  };
  
  
  export const evalJson = async ({
    contractAddress,
    functionName,
    provider,
    args = [],
  }: {
    contractAddress: string;
    functionName: string;
    provider: NativeClarityBinProvider;
    args?: string[];
  }) => {
    const evalCode = `(${functionName} ${args.join(' ')})`;
    const receipt = await provider.runCommand(
      ['eval_at_chaintip', '--costs', contractAddress, provider.dbFilePath],
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
  };
  
  export interface ClarinetAccount {
    balance: number;
    address: string;
  }
  
  export interface ClarinetAccounts {
    deployer: ClarinetAccount;
    [key: string]: ClarinetAccount;
  }
  
  type AllocationOrAccounts = ClarinetAccounts | Allocation[];
  
  export function getAllocations(allocations?: AllocationOrAccounts): Allocation[] {
    if (!allocations) return [];
    if ('deployer' in allocations) {
      return Object.values(allocations).map(a => ({
        amount: a.balance,
        principal: a.address,
      }));
    } else if (Array.isArray(allocations)) {
      return allocations;
    }
    return [];
  }
  
  export const createClarityBin = async ({
    allocations,
  }: { allocations?: AllocationOrAccounts } = {}) => {
    const binFile = getDefaultBinaryFilePath();
    const dbFileName = getTempFilePath();
    const _allocations = getAllocations(allocations);
    const provider = await NativeClarityBinProvider.create(_allocations, dbFileName, binFile);
    return provider;
  };
  
  export async function getDefaultClarityBin(
    clarityBinOrAccounts?: NativeClarityBinProvider | ClarinetAccounts
  ) {
    let clarityBin: NativeClarityBinProvider;
    if (!clarityBinOrAccounts) {
      clarityBin = await createClarityBin();
    } else if ('deployer' in clarityBinOrAccounts) {
      clarityBin = await createClarityBin({ allocations: clarityBinOrAccounts });
      // } else if ('closeActions' in clarityBinOrAccounts) {
    } else if (clarityBinOrAccounts instanceof NativeClarityBinProvider) {
      clarityBin = clarityBinOrAccounts;
    } else {
      throw new Error('Should never get here');
    }
    return clarityBin;
  }
  
  export async function deployContract(client: Client, provider: NativeClarityBinProvider) {
    const receipt = await provider.runCommand([
      'launch',
      client.name,
      client.filePath,
      provider.dbFilePath,
      '--costs',
      '--assets',
    ]);
    if (receipt.stderr) {
      throw new Error(`Error on ${client.filePath}:
    ${receipt.stderr}
      `);
    }
    const output = JSON.parse(receipt.stdout);
    if (output.error) {
      const { initialization } = output.error;
      if (initialization?.includes('\nNear:\n')) {
        const [error, trace] = initialization.split('\nNear:\n');
        let startLine = '';
        const matcher = /start_line: (\d+),/;
        const matches = matcher.exec(trace);
        if (matches) startLine = matches[1];
        throw new Error(`Error on ${client.filePath}:
      ${error}
      ${startLine ? `Near line ${startLine}` : ''}
      Raw trace:
      ${trace}
        `);
      }
      throw new Error(`Error on ${client.filePath}:
    ${JSON.stringify(output.error, null, 2)}
      `);
    }
  }
  