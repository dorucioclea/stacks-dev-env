import { ResultAssets } from "../transaction";

export interface ClarinetAccount {
  balance: number;
  address: string;
}

export interface ClarinetAccounts {
  deployer: ClarinetAccount;
  [key: string]: ClarinetAccount;
}

export type AllocationOrAccounts = ClarinetAccounts | Allocation[];

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
