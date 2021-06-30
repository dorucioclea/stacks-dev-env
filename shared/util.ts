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


  