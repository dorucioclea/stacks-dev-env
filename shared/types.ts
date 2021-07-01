import { NativeClarityBinProvider } from '@blockstack/clarity';
import { StacksNetwork } from '@stacks/network';
import type { BaseProvider } from './providers/base-provider';
import { ResultAssets, Transaction } from './transaction';

export type ContractBuilder<T> = (provider: BaseProvider) => T;
export interface Contract<T> {
  address: string;
  contractFile: string;
  contract: ContractBuilder<T>;
}

export interface Contracts<T> {
  [key: string]: Contract<T>;
}

export interface ContractInstance<T> {
  identifier: string;
  contract: T;
}

export type ContractInstances<T extends Contracts<M>, M> = {
  [Name in keyof T]: ContractInstance<ReturnType<T[Name]['contract']>>;
};


export interface EvalOk {
    success: true;
    costs: {
      [key: string]: any;
      runtime: number;
    };
    output_serialized: string;
  }
  
  export interface EvalErr {
    success: false;
    error: string;
  }
  
  export type EvalResult = EvalOk | EvalErr;

  
export interface Allocation {
    principal: string;
    amount: number;
  }
  
  export interface ExecuteOk {
    success: true;
    message: string;
    events: any[];
    output_serialized: string;
    costs: {
      [key: string]: any;
      runtime: number;
    };
    assets: ResultAssets;
    // todo: logs
  }
  
  export interface ExecuteErr {
    message: string;
    error: any;
    output_serialized: string;
    costs: {
      [key: string]: any;
      runtime: number;
    };
    assets: ResultAssets;
    success: false;
  }
  
  export type ExecuteResult = ExecuteOk | ExecuteErr;
  
  
export interface CreateOptions {
    allocations?: Allocation[];
    contractIdentifier: string;
    contractFilePath: string;
    clarityBin: NativeClarityBinProvider;
  }
  
  export interface FromContractOptions<T> {
    contract: Contract<T>;
    clarityBin: NativeClarityBinProvider;
  }
  
  export  interface UtilsContract {
    getBlockHeight: Promise<number>;
  }