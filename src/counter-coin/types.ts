import { Transaction } from '../../shared/transaction';
import { ClarityTypes } from '../../shared/clarity/types';

// prettier-ignore

export interface CounterCoinContract {
  getTokenUri: () => Transaction<string | null, null>;
  mint: (recipient: string, amount: number) => Transaction<boolean, number>;
  transfer: (amount: number, sender: string, recipient: string, memo: Buffer | null) => Transaction<boolean, number>;
  getBalance: (owner: string) => Promise<ClarityTypes.Response<number, null>>;
  getDecimals: () => Promise<ClarityTypes.Response<number, null>>;
  getName: () => Promise<ClarityTypes.Response<string, null>>;
  getSymbol: () => Promise<ClarityTypes.Response<string, null>>;
  getTotalSupply: () => Promise<ClarityTypes.Response<number, null>>;
}
