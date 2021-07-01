import { Transaction } from '../../shared/transaction';
import { ClarityTypes } from '../../shared/clarity/types';

// prettier-ignore

export interface SimpleCounterContract {
  decrement: () => Transaction<number, null>;
  increment: () => Transaction<number, null>;
  getCounter: () => Promise<number>;
}
