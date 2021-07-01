import { Transaction } from '../../shared/transaction';
import { ClarityTypes } from '../../shared/clarity/types';

// prettier-ignore

export interface CounterContract {

  decrement: () => Transaction<number, number>;
  increment: () => Transaction<number, number>;
  getCounter: () => Promise<number>;
}
