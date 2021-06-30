import { Transaction } from '../../shared/transaction';
import { ClarityTypes } from '../../shared/clarity/types';

// prettier-ignore

export interface CounterContract {
  decrement: () => Transaction<number, null>;
  increment: () => Transaction<number, null>;
  getCounter: () => Promise<ClarityTypes.Response<number, null>>;
}
