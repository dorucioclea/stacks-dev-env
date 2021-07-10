import { Contract } from '../../shared/types';
import { proxy } from '../../shared/test-utils/proxy';
import { BaseProvider } from '../../shared/providers/base-provider';

import type { SimpleCounterContract } from './types';
import { SimpleCounterInterface } from './abi';

export type { SimpleCounterContract } from './types';

export const simpleCounterContract = (provider: BaseProvider) => {
  const contract = proxy<SimpleCounterContract>(SimpleCounterInterface, provider);
  return contract;
};

export const simpleCounterInfo: Contract<SimpleCounterContract> = {
  contract: simpleCounterContract,
  address: 'ST1HJ4TYWQV3MCSP2T751GDN39PTENCX72HPQYDCM',
  contractFile: 'contracts\\simple-counter.clar',
};
