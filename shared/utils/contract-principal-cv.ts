import BN from "bn.js"
import { Contract } from '../types';

import { promises as fileSystemPath } from 'fs';
import { getContractNameFromPath } from "./contract-name-for-path";
import { contractPrincipalCV } from "@stacks/transactions";

export const getContractPrincipalCV = <T>(contract: Contract<T>) => {
  const contractName = getContractNameFromPath(contract.contractFile);
  return contractPrincipalCV(contract.address, contractName);
};


  