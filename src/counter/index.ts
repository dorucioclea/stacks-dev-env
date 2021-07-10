import { Contract } from '../../shared/types';
import { proxy } from '../../shared/test-utils/proxy';
import { BaseProvider } from '../../shared/providers/base-provider';

import type { CounterContract } from './types';
import { CounterInterface } from './abi';

export type { CounterContract } from './types';

export const counterContract = (provider: BaseProvider) => {
  const contract = proxy<CounterContract>(CounterInterface, provider);
  return contract;
};

export const counterInfo: Contract<CounterContract> = {
  contract: counterContract,
  address: 'ST1HJ4TYWQV3MCSP2T751GDN39PTENCX72HPQYDCM',
  contractFile: 'contracts\\counter.clar',
};
