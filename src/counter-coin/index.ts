import { Contract } from '../../shared/types';
import { proxy } from '../../shared/test-utils/proxy';
import { BaseProvider } from '../../shared/providers/base-provider';

import type { CounterCoinContract } from './types';
import { CounterCoinInterface } from './abi';

export type { CounterCoinContract } from './types';

export const counterCoinContract = (provider: BaseProvider) => {
  const contract = proxy<CounterCoinContract>(CounterCoinInterface, provider);
  return contract;
};

export const counterCoinInfo: Contract<CounterCoinContract> = {
  contract: counterCoinContract,
  address: 'ST1HJ4TYWQV3MCSP2T751GDN39PTENCX72HPQYDCM',
  contractFile: 'contracts\\counter-coin.clar',
};
