import BN from "bn.js"
import { ClarityAbi, ClarityAbiType, ClarityValue, isClarityAbiBuffer, isClarityAbiList, isClarityAbiOptional, isClarityAbiPrimitive, isClarityAbiResponse, isClarityAbiStringAscii, isClarityAbiStringUtf8, isClarityAbiTuple, serializeCV } from '@stacks/transactions';
import { contractPrincipalCV } from '@stacks/transactions';
import { Allocation, Contract, EvalErr, EvalResult, ExecuteResult } from '../types';
import { Client, NativeClarityBinProvider } from '@blockstack/clarity';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';

import { promises as fileSystemPath } from 'fs';

export const getContractNameFromPath = (path: string) => {

  const contractPaths = path.normalize().split('\\');
  const filename = contractPaths[contractPaths.length - 1];
  const [contractName] = filename.split('.');
  return contractName;
};